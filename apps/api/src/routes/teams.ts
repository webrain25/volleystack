import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export default async function teamRoutes(fastify: FastifyInstance) {
  // Create a new team
  fastify.post('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const createTeamSchema = z.object({
      name: z.string().min(1),
      role: z.nativeEnum(Role).optional(),
      isPlayer: z.boolean().default(true)
    });

    const parsed = createTeamSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid input' });
    }

    const { name, role, isPlayer } = parsed.data;

    const rolesToCreate: { role: Role }[] = [{ role: Role.ADMIN }];
    if (role && role !== Role.ADMIN) {
      rolesToCreate.push({ role });
    }
    if (isPlayer && !rolesToCreate.some(r => r.role === Role.PLAYER)) {
      rolesToCreate.push({ role: Role.PLAYER });
    }

    const team = await prisma.team.create({
      data: {
        name,
        members: {
          create: {
            userId: request.user.id,
            isPlayer,
            roles: {
              create: rolesToCreate
            }
          }
        }
      },
      include: {
        members: true
      }
    });

    return reply.status(201).send(team);
  });

  // Join a team by join code
  fastify.post('/join', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const joinSchema = z.object({
      joinCode: z.string().min(1),
    });

    const parsed = joinSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid input' });
    }

    const { joinCode } = parsed.data;

    const team = await prisma.team.findUnique({ where: { joinCode } });
    if (!team) {
      return reply.status(404).send({ error: 'Team not found or invalid join code' });
    }

    // Check if already member
    const existing = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: request.user.id,
          teamId: team.id
        }
      }
    });

    if (existing) {
      return reply.status(400).send({ error: 'Already a member of this team' });
    }

    const member = await prisma.teamMember.create({
      data: {
        userId: request.user.id,
        teamId: team.id,
        roles: {
          create: {
            role: Role.PLAYER
          }
        }
      },
      include: {
        roles: true
      }
    });

    return reply.status(201).send(member);
  });

  // Get a specific team
  fastify.get('/:teamId', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid param' });

    const teamId = parsed.data.teamId;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } }, roles: true } }
      }
    });

    return reply.send(team);
  });

  // Update join code
  fastify.patch('/:teamId/join-code', { onRequest: [fastify.authorize('TEAM_SETTINGS_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const schema = z.object({
      joinCode: z.string().min(3).max(12).toUpperCase(),
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Codice non valido. Deve essere tra 3 e 12 caratteri.' });
    }

    const { teamId } = parsedParams.data;
    const { joinCode } = parsed.data;

    // Check if code is already used
    const existing = await prisma.team.findUnique({ where: { joinCode } });
    if (existing && existing.id !== teamId) {
      return reply.status(400).send({ error: 'Questo codice invito è già in uso. Scegline un altro.' });
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: { joinCode }
    });

    return reply.send(team);
  });

  // Update paypal link
  fastify.patch('/:teamId/paypal-link', { onRequest: [fastify.authorize('TEAM_SETTINGS_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const schema = z.object({
      paypalLink: z.string().url().or(z.string().length(0)).nullable(),
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Link non valido. Assicurati che sia un URL completo (es. https://paypal.me/tuonome)' });
    }

    const { teamId } = parsedParams.data;
    const { paypalLink } = parsed.data;

    const team = await prisma.team.update({
      where: { id: teamId },
      data: { paypalLink: paypalLink || null }
    });

    return reply.send(team);
  });

  // Create a ghost member (user without real account)
  fastify.post('/:teamId/ghost-members', { onRequest: [fastify.authorize('TEAM_SETTINGS_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const schema = z.object({
      name: z.string().min(1),
      role: z.nativeEnum(Role).default(Role.PLAYER)
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    const { name, role } = parsed.data;
    
    // Check if team exists
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return reply.status(404).send({ error: 'Team not found' });

    // Create a fake ghost user
    const ghostEmail = `ghost_${Date.now()}_${Math.random().toString(36).substring(2, 7)}@volleystack.local`;
    
    // We import bcrypt dynamically or use a dummy hash since they can't login anyway
    const dummyHash = 'ghost_user_no_login'; 

    const user = await prisma.user.create({
      data: {
        email: ghostEmail,
        name,
        passwordHash: dummyHash
      }
    });

    const member = await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId,
        roles: {
          create: { role }
        }
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        roles: true
      }
    });

    return reply.status(201).send(member);
  });

  // Get team stats
  fastify.get('/:teamId/stats', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsed = paramsSchema.safeParse(request.params);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid param' });

    const teamId = parsed.data.teamId;

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: { select: { name: true, email: true } },
        fines: true,
        attendance: true,
        rsvps: true
      }
    });

    const stats = members.map(m => {
      const totalFines = m.fines.reduce((acc, f) => acc + f.amountCents, 0);
      const paidFines = m.fines.filter(f => f.status === 'PAID').reduce((acc, f) => acc + f.amountCents, 0);
      
      const totalEvents = m.attendance.length;
      const presentEvents = m.attendance.filter(a => a.isPresent).length;
      const attendanceRate = totalEvents > 0 ? (presentEvents / totalEvents) * 100 : 0;

      return {
        memberId: m.id,
        name: m.user.name || m.user.email,
        totalFinesCents: totalFines,
        paidFinesCents: paidFines,
        unpaidFinesCents: totalFines - paidFines,
        attendanceRate,
        eventsAttended: presentEvents,
        totalEvents
      };
    });

    // Sort by unpaid fines (desc) for top finers, and attendance rate (desc)
    stats.sort((a, b) => b.unpaidFinesCents - a.unpaidFinesCents);

    return reply.send(stats);
  });

  // Transfer ownership
  fastify.post('/:teamId/transfer-ownership', { onRequest: [fastify.authorize('TEAM_SETTINGS_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const schema = z.object({
      targetMemberId: z.string()
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    const { targetMemberId } = parsed.data;

    // Find the current owner (the requester)
    const currentOwnerMember = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: request.user.id, teamId } },
      include: { roles: true }
    });

    if (!currentOwnerMember || !currentOwnerMember.roles.some(r => r.role === 'ADMIN')) {
      return reply.status(403).send({ error: 'Devi essere proprietario per trasferire la proprietà' });
    }

    // Find the target member
    const targetMember = await prisma.teamMember.findUnique({
      where: { id: targetMemberId },
      include: { roles: true }
    });

    if (!targetMember || targetMember.teamId !== teamId) {
      return reply.status(404).send({ error: 'Membro target non trovato' });
    }

    // Use a transaction to swap roles
    await prisma.$transaction(async (tx) => {
      // 1. Remove all roles from the current owner
      await tx.teamMemberRole.deleteMany({
        where: { teamMemberId: currentOwnerMember.id }
      });

      // 2. Add PLAYER role to the current owner (so they are not role-less)
      await tx.teamMemberRole.create({
        data: { teamMemberId: currentOwnerMember.id, role: 'PLAYER' }
      });

      // 3. Remove all roles from target member
      await tx.teamMemberRole.deleteMany({
        where: { teamMemberId: targetMember.id }
      });

      // 4. Add OWNER role to the target member
      await tx.teamMemberRole.create({
        data: { teamMemberId: targetMember.id, role: 'ADMIN' }
      });
    });

    return reply.send({ success: true });
  });

  // Update a team member (roles, isPlayer, etc)
  fastify.patch('/:teamId/members/:memberId', { onRequest: [fastify.authorize('ROLE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), memberId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const schema = z.object({
      roles: z.array(z.nativeEnum(Role)).optional(),
      isPlayer: z.boolean().optional(),
      shirtNumber: z.number().nullable().optional()
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId, memberId } = parsedParams.data;
    const { roles, isPlayer, shirtNumber } = parsed.data;

    const targetMember = await prisma.teamMember.findUnique({
      where: { id: memberId, teamId },
      include: { roles: true }
    });
    if (!targetMember) return reply.status(404).send({ error: 'Member not found' });

    await prisma.$transaction(async (tx) => {
      const updateData: any = {};
      let finalIsPlayer = isPlayer !== undefined ? isPlayer : targetMember.isPlayer;

      if (roles) {
        // Se è capitano o vice capitano, è per forza anche un giocatore
        if (roles.includes(Role.CAPTAIN) || roles.includes(Role.VICE_CAPTAIN)) {
          finalIsPlayer = true;
        }

        await tx.teamMemberRole.deleteMany({ where: { teamMemberId: memberId } });
        if (roles.length > 0) {
          await tx.teamMemberRole.createMany({
            data: roles.map(r => ({ teamMemberId: memberId, role: r }))
          });
        }
      }

      if (finalIsPlayer !== targetMember.isPlayer) {
        updateData.isPlayer = finalIsPlayer;
      }
      if (shirtNumber !== undefined) {
        updateData.shirtNumber = shirtNumber;
      }

      if (Object.keys(updateData).length > 0) {
        await tx.teamMember.update({
          where: { id: memberId },
          data: updateData
        });
      }
    });

    return reply.send({ success: true });
  });

}
