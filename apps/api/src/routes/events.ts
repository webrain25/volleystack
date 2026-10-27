import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';
import { EventType, RsvpStatus } from '@prisma/client';
import * as cheerio from 'cheerio';

export default async function eventRoutes(fastify: FastifyInstance) {
  // Create event
  fastify.post('/', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const createEventSchema = z.object({
      title: z.string().min(1),
      type: z.nativeEnum(EventType),
      date: z.string().datetime(),
      location: z.string().optional(),
      recurrenceUntil: z.string().datetime().optional()
    });

    const parsed = createEventSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    const { title, type, date, location, recurrenceUntil } = parsed.data;
    
    const startDate = new Date(date);
    const eventsData = [];
    
    eventsData.push({
      teamId,
      title,
      type,
      date: startDate,
      location,
    });
    
    if (recurrenceUntil) {
      const untilDate = new Date(recurrenceUntil);
      let nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + 7); // add 7 days
      
      while (nextDate <= untilDate) {
        eventsData.push({
          teamId,
          title,
          type,
          date: new Date(nextDate),
          location,
        });
        nextDate.setDate(nextDate.getDate() + 7);
      }
    }

    const createdEvents = await prisma.$transaction(
      eventsData.map(data => prisma.event.create({ data }))
    );

    return reply.status(201).send(createdEvents[0]);
  });

  // Bulk Create Events (Smart Calendar)
  fastify.post('/bulk', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const bulkEventSchema = z.array(z.object({
      title: z.string().min(1),
      type: z.nativeEnum(EventType),
      date: z.string().datetime(),
      location: z.string().optional()
    }));

    const parsed = bulkEventSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    
    const createdEvents = await prisma.$transaction(
      parsed.data.map(data => prisma.event.create({ 
        data: {
          teamId,
          title: data.title,
          type: data.type,
          date: new Date(data.date),
          location: data.location
        }
      }))
    );

    return reply.status(201).send({ count: createdEvents.length });
  });

  // --- FIPAV ONLINE / ITALVOLLEY INTEGRATION ---

  // 1. Get Committees list
  fastify.get('/fipav/committees', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (_request, reply) => {
    try {
      const res = await globalThis.fetch('https://public.fipavonline.it/data/committees.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      const rawRegioni = json?.regioni || {};
      const list: Array<{ id: string; name: string; region: string; isRegion: boolean }> = [];

      for (const [regioneName, data] of Object.entries<any>(rawRegioni)) {
        for (const comitato of data.comitati || []) {
          list.push({
            id: String(comitato.id),
            name: comitato.nome,
            region: regioneName,
            isRegion: comitato.is_regione === '1'
          });
        }
      }

      // Prioritize Lazio / Roma at the top
      list.sort((a, b) => {
        if (a.id === '12060') return -1;
        if (b.id === '12060') return 1;
        if (a.id === '12000') return -1;
        if (b.id === '12000') return 1;
        if (a.region === 'Lazio' && b.region !== 'Lazio') return -1;
        if (b.region === 'Lazio' && a.region !== 'Lazio') return 1;
        return a.name.localeCompare(b.name);
      });

      return reply.send(list);
    } catch (err: any) {
      return reply.status(500).send({ error: 'Errore caricamento comitati FIPAV: ' + err.message });
    }
  });

  // 2. Get Gironi for a committee
  fastify.get('/fipav/committees/:committeeId/gironi', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), committeeId: z.string() });
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid param' });

    try {
      const { committeeId } = parsed.data;
      const res = await globalThis.fetch(`https://data.fipavonline.it/api/v2/calendar/${encodeURIComponent(committeeId)}/0`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      const gironiRaw = Array.isArray(json?.data) ? json.data : (json?.data?.gironi || []);
      
      const gironi = gironiRaw.map((g: any) => ({
        id: String(g.id),
        title: g.title,
        championship: g.parent || g.title,
        subTitle: g['sub-title'] || '',
        shortTitle: g['title-short'] || ''
      }));

      return reply.send(gironi);
    } catch (err: any) {
      return reply.status(500).send({ error: 'Errore caricamento gironi: ' + err.message });
    }
  });

  // 3. Get teams and match count for a girone
  fastify.get('/fipav/gironi/:gironeId/teams', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), gironeId: z.string() });
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid param' });

    try {
      const { gironeId } = parsed.data;
      const res = await globalThis.fetch(`https://data.fipavonline.it/api/v2/calendar/0/${encodeURIComponent(gironeId)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      const matches: any[] = json?.data?.matches || [];

      const teamsMap = new Map<string, { name: string; matchCount: number; logo?: string }>();

      for (const m of matches) {
        const t1 = m.team1?.title;
        const t2 = m.team2?.title;

        if (t1) {
          const cur = teamsMap.get(t1) || { name: t1, matchCount: 0, logo: m.team1?.logo };
          cur.matchCount++;
          teamsMap.set(t1, cur);
        }
        if (t2) {
          const cur = teamsMap.get(t2) || { name: t2, matchCount: 0, logo: m.team2?.logo };
          cur.matchCount++;
          teamsMap.set(t2, cur);
        }
      }

      return reply.send({
        gironeTitle: json?.data?.title || '',
        totalMatches: matches.length,
        teams: Array.from(teamsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
      });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Errore caricamento squadre girone: ' + err.message });
    }
  });

  // 4. Import matches for selected team in a girone
  fastify.post('/fipav/import', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const bodySchema = z.object({
      gironeId: z.string().min(1),
      teamName: z.string().min(1)
    });
    const parsedBody = bodySchema.safeParse(request.body);
    if (!parsedBody.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    const { gironeId, teamName } = parsedBody.data;
    const teamNameLower = teamName.toLowerCase().trim();

    try {
      const res = await globalThis.fetch(`https://data.fipavonline.it/api/v2/calendar/0/${encodeURIComponent(gironeId)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: any = await res.json();
      const matches: any[] = json?.data?.matches || [];

      // Filter matches where selected team plays (home or away)
      const teamMatches = matches.filter((m: any) => {
        const t1 = (m.team1?.title || '').toLowerCase().trim();
        const t2 = (m.team2?.title || '').toLowerCase().trim();
        return t1 === teamNameLower || t2 === teamNameLower;
      });

      if (teamMatches.length === 0) {
        return reply.status(404).send({ error: `Nessuna partita trovata per "${teamName}" in questo girone.` });
      }

      const eventsData = teamMatches.map((m: any) => {
        const isHome = (m.team1?.title || '').toLowerCase().trim() === teamNameLower;
        const opponent = isHome ? (m.team2?.title || 'Avversario') : (m.team1?.title || 'Avversario');
        const dayLabel = m.day ? ` (${m.day})` : '';
        const title = isHome ? `Partita vs ${opponent}${dayLabel}` : `Trasferta vs ${opponent}${dayLabel}`;

        // Parse date
        let matchDate: Date;
        if (m.date && m.time) {
          const [day, month, year] = m.date.split('/');
          const cleanTime = m.time.replace('.', ':');
          const [hour, min] = cleanTime.split(':');
          matchDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour) || 20, parseInt(min) || 30);
        } else if (m.ts_gara) {
          matchDate = new Date(parseInt(m.ts_gara) * 1000);
        } else {
          matchDate = new Date();
        }

        const location = m.stadium || (isHome ? 'Palestra di Casa' : 'Palazzetto Trasferta');

        return {
          teamId,
          title,
          type: EventType.MATCH,
          date: matchDate,
          location
        };
      });

      const createdEvents = await prisma.$transaction(
        eventsData.map(data => prisma.event.create({ data }))
      );

      return reply.status(201).send({
        count: createdEvents.length,
        events: createdEvents
      });
    } catch (err: any) {
      return reply.status(500).send({ error: 'Errore durante importazione gare FIPAV: ' + err.message });
    }
  });

  // Import from FIPAV Scraper
  fastify.post('/import/scraper', { onRequest: [fastify.authorize('EVENT_TRAINING_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const importSchema = z.object({
      url: z.string().url(),
      teamName: z.string().min(1)
    });

    const parsed = importSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    const { url, teamName } = parsed.data;

    try {
      const res = await globalThis.fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const html = await res.text();
      
      const $ = cheerio.load(html);
      const eventsData: any[] = [];
      const teamNameLower = teamName.toLowerCase().trim();

      // FIPAV Online typically uses tables with rows (tr) for matches
      // We will look for <tr> elements that contain dates like dd/mm/yyyy
      $('tr').each((i: number, el: any) => {
        const text = $(el).text();
        // Check if row contains our team name
        if (text.toLowerCase().includes(teamNameLower)) {
          const cols = $(el).find('td');
          if (cols.length >= 4) {
            // Very heuristic parsing!
            // Typical FIPAV: [Gara, Data, Ora, Sq. Casa, Sq. Ospite, Impianto]
            // We'll extract all text and try to find a date DD/MM/YYYY and HH:MM
            const texts = cols.map((_: number, td: any) => $(td).text().trim()).get();
            
            let dateStr = '';
            let timeStr = '20:30';
            let location = '';
            let title = '';
            
            // Try to guess columns
            texts.forEach((t: string) => {
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(t)) dateStr = t;
              else if (/^\d{2}:\d{2}$/.test(t)) timeStr = t;
              else if (t.toLowerCase().includes(teamNameLower) && t.toLowerCase() !== teamNameLower) {
                // Not just our team name, maybe the opponent or the match title?
              }
            });

            // If we found a date, it's a match!
            if (dateStr) {
              const [day, month, year] = dateStr.split('/');
              const [hour, minute] = timeStr.split(':');
              const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
              
              // Find the other team
              const otherTeam = texts.find((t: string) => 
                t && !/^\d/.test(t) && !t.toLowerCase().includes(teamNameLower) && t.length > 3
              ) || 'Avversario FIPAV';

              const isHome = texts.findIndex((t: string) => t.toLowerCase() === teamNameLower) < texts.findIndex((t: string) => t === otherTeam);
              
              title = `Partita vs ${otherTeam}`;
              location = texts[texts.length - 1] || 'Palestra FIPAV'; // Usually last column is location

              eventsData.push({
                teamId,
                title,
                type: EventType.MATCH,
                date: dateObj,
                location
              });
            }
          }
        }
      });

      if (eventsData.length === 0) {
        return reply.status(404).send({ error: 'Nessuna partita trovata per questa squadra a questo URL.' });
      }

      const createdEvents = await prisma.$transaction(
        eventsData.map(data => prisma.event.create({ data }))
      );

      return reply.status(201).send({ count: createdEvents.length, events: createdEvents });
    } catch (error: any) {
      console.error('Scraper error:', error);
      return reply.status(500).send({ error: 'Errore durante la lettura del calendario: ' + error.message });
    }
  });

  // Get events
  fastify.get('/', { onRequest: [fastify.authorize('EVENT_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const { teamId } = parsedParams.data;

    const events = await prisma.event.findMany({
      where: { teamId },
      include: { rsvps: true, attendance: true },
      orderBy: { date: 'asc' }
    });

    return reply.send(events);
  });

  // Update event
  fastify.patch('/:eventId', { onRequest: [fastify.authorize('EVENT_TRAINING_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const updateEventSchema = z.object({
      title: z.string().optional(),
      type: z.nativeEnum(EventType).optional(),
      date: z.string().datetime().optional(),
      location: z.string().optional()
    });

    const parsed = updateEventSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const dataToUpdate: any = { ...parsed.data };
    if (parsed.data.date) {
      dataToUpdate.date = new Date(parsed.data.date);
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parsedParams.data.eventId },
      data: dataToUpdate
    });

    return reply.send(updatedEvent);
  });

  // RSVP to an event
  fastify.post('/:eventId/rsvp', { onRequest: [fastify.authorize('EVENT_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const rsvpSchema = z.object({
      status: z.nativeEnum(RsvpStatus),
    });

    const parsed = rsvpSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId, eventId } = parsedParams.data;
    const { status } = parsed.data;

    const membership = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: request.user.id, teamId } }
    });

    if (!membership) return reply.status(403).send({ error: 'Forbidden' });

    const rsvp = await prisma.rsvp.upsert({
      where: {
        eventId_teamMemberId: {
          eventId,
          teamMemberId: membership.id
        }
      },
      update: { status },
      create: {
        eventId,
        teamMemberId: membership.id,
        status
      }
    });

    return reply.send(rsvp);
  });

  // Get event attendance
  fastify.get('/:eventId/attendance', { onRequest: [fastify.authorize('EVENT_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const attendance = await prisma.attendance.findMany({
      where: { eventId: parsedParams.data.eventId },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    return reply.send(attendance);
  });

  // Set event attendance
  fastify.post('/:eventId/attendance', { onRequest: [fastify.authorize('ATTENDANCE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const attendanceSchema = z.object({
      teamMemberId: z.string(),
      isPresent: z.boolean()
    });

    const parsed = attendanceSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { eventId } = parsedParams.data;
    const { teamMemberId, isPresent } = parsed.data;

    const attendance = await prisma.attendance.upsert({
      where: {
        eventId_teamMemberId: {
          eventId,
          teamMemberId
        }
      },
      update: { isPresent },
      create: {
        eventId,
        teamMemberId,
        isPresent
      }
    });

    return reply.send(attendance);
  });

  // Get duties for an event
  fastify.get('/:eventId/duties', { onRequest: [fastify.authorize('EVENT_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const duties = await prisma.duty.findMany({
      where: { eventId: parsedParams.data.eventId },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    return reply.send(duties);
  });

  // Assign a duty
  fastify.post('/:eventId/duties', { onRequest: [fastify.authorize('EVENT_TRAINING_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const dutySchema = z.object({
      teamMemberId: z.string(),
      description: z.string().min(1)
    });

    const parsed = dutySchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { eventId } = parsedParams.data;
    const { teamMemberId, description } = parsed.data;

    const duty = await prisma.duty.create({
      data: {
        eventId,
        teamMemberId,
        description
      },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    return reply.status(201).send(duty);
  });

  // Toggle duty completion status
  fastify.patch('/:eventId/duties/:dutyId/toggle', { onRequest: [fastify.authorize('EVENT_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string(), dutyId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const duty = await prisma.duty.findUnique({
      where: { id: parsedParams.data.dutyId }
    });

    if (!duty) return reply.status(404).send({ error: 'Duty not found' });

    // In a real app, verify the user is either the assigned member or has manage perms.
    // Simplifying here to allow anyone to check it off for V1.5.

    const updated = await prisma.duty.update({
      where: { id: duty.id },
      data: { isCompleted: !duty.isCompleted },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });

    return reply.send(updated);
  });

  // Delete a duty
  fastify.delete('/:eventId/duties/:dutyId', { onRequest: [fastify.authorize('EVENT_TRAINING_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), eventId: z.string(), dutyId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    await prisma.duty.delete({
      where: { id: parsedParams.data.dutyId }
    });

    return reply.status(204).send();
  });
}
