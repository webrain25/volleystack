import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';
import { 
  generatePasteReason, 
  generateAnnouncementDraft, 
  generateCoachSpeech, 
  generateWithGemini 
} from '../lib/gemini';

export default async function aiRoutes(fastify: FastifyInstance) {
  // Suggest a funny reason for pastries/paste penalty
  fastify.post('/paste-reason', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Parametri non validi' });

    const bodySchema = z.object({
      teamMemberId: z.string().optional(),
      hint: z.string().optional()
    });

    const parsedBody = bodySchema.safeParse(request.body);
    if (!parsedBody.success) return reply.status(400).send({ error: 'Input non valido' });

    let playerName: string | undefined;
    if (parsedBody.data.teamMemberId) {
      const member = await prisma.teamMember.findUnique({
        where: { id: parsedBody.data.teamMemberId },
        include: { user: true }
      });
      playerName = member?.user?.name || undefined;
    }

    try {
      const reason = await generatePasteReason(playerName, parsedBody.data.hint);
      return reply.send({ reason });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Impossibile generare la motivazione con Gemini', details: err.message });
    }
  });

  // Generate an announcement draft for the team
  fastify.post('/announcement-draft', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Parametri non validi' });

    const bodySchema = z.object({
      topic: z.string().min(1, 'L\'argomento è obbligatorio'),
      details: z.string().optional()
    });

    const parsedBody = bodySchema.safeParse(request.body);
    if (!parsedBody.success) return reply.status(400).send({ error: 'Input non valido' });

    try {
      const draft = await generateAnnouncementDraft(parsedBody.data.topic, parsedBody.data.details);
      return reply.send(draft);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Impossibile generare la bozza con Gemini', details: err.message });
    }
  });

  // Generate a motivational speech or pre-match talk
  fastify.post('/coach-speech', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Parametri non validi' });

    const bodySchema = z.object({
      eventId: z.string().optional(),
      eventType: z.enum(['MATCH', 'TRAINING', 'SOCIAL']).optional(),
      opponent: z.string().optional(),
      notes: z.string().optional()
    });

    const parsedBody = bodySchema.safeParse(request.body);
    if (!parsedBody.success) return reply.status(400).send({ error: 'Input non valido' });

    const team = await prisma.team.findUnique({
      where: { id: parsedParams.data.teamId }
    });

    let eventType: 'MATCH' | 'TRAINING' | 'SOCIAL' = parsedBody.data.eventType || 'MATCH';
    let notes = parsedBody.data.notes;

    if (parsedBody.data.eventId) {
      const event = await prisma.event.findUnique({
        where: { id: parsedBody.data.eventId }
      });
      if (event) {
        eventType = event.type as any;
        notes = notes ? `${notes} (Evento: ${event.title})` : `Evento: ${event.title}`;
      }
    }

    try {
      const speech = await generateCoachSpeech({
        teamName: team?.name,
        eventType,
        opponent: parsedBody.data.opponent,
        notes
      });
      return reply.send({ speech });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Impossibile generare il discorso del coach', details: err.message });
    }
  });

  // Generic team volleyball assistant
  fastify.post('/chat', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const bodySchema = z.object({
      message: z.string().min(1)
    });

    const parsedBody = bodySchema.safeParse(request.body);
    if (!parsedBody.success) return reply.status(400).send({ error: 'Messaggio non valido' });

    try {
      const systemInstruction = 
        "Sei VolleyBot, l'assistente esperto di pallavolo e coach virtuale di VolleyStack. " +
        "Aiuti atleti e allenatori con regole di pallavolo, esercizi, tattiche (rotazioni, P1, schemi difensivi) e consigli di squadra in italiano.";

      const replyText = await generateWithGemini(parsedBody.data.message, { systemInstruction });
      return reply.send({ reply: replyText });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Errore assistente Gemini', details: err.message });
    }
  });
}
