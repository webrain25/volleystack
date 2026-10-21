import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';

export default async function announcementRoutes(fastify: FastifyInstance) {
  // Get announcements
  fastify.get('/', { onRequest: [fastify.authorize('TEAM_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const announcements = await prisma.announcement.findMany({
      where: { 
        teamId: parsedParams.data.teamId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        author: {
          include: { user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reply.send(announcements);
  });

  // Create announcement
  fastify.post('/', { onRequest: [fastify.authorize('ANNOUNCEMENT_CREATE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const createSchema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      expiresAt: z.string().datetime().optional()
    });

    const parsed = createSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const membership = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: request.user.id, teamId: parsedParams.data.teamId } }
    });

    if (!membership) return reply.status(403).send({ error: 'Forbidden' });

    const announcement = await prisma.announcement.create({
      data: {
        teamId: parsedParams.data.teamId,
        authorId: membership.id,
        title: parsed.data.title,
        content: parsed.data.content,
        expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      },
      include: {
        author: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    });

    return reply.status(201).send(announcement);
  });
}
