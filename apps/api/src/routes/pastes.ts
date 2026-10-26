import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';
import { PasteStatus } from '@prisma/client';

export default async function pasteRoutes(fastify: FastifyInstance) {
  // Get all pastes for a team
  fastify.get('/', { onRequest: [fastify.authorize('PASTRY_VIEW_ALL')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const pastes = await prisma.paste.findMany({
      where: { teamMember: { teamId: parsedParams.data.teamId } },
      include: {
        teamMember: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      },
      orderBy: { assignedAt: 'desc' }
    });

    return reply.send(pastes);
  });

  // Assign a paste
  fastify.post('/', { onRequest: [fastify.authorize('PASTRY_ASSIGN')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const pasteSchema = z.object({
      teamMemberId: z.string(),
      reason: z.string().min(1),
      deadline: z.string().datetime().optional()
    });

    const parsed = pasteSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    // Verify member belongs to team
    const member = await prisma.teamMember.findUnique({
      where: { id: parsed.data.teamMemberId }
    });

    if (!member || member.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Member not found in team' });
    }

    const paste = await prisma.paste.create({
      data: {
        teamMemberId: parsed.data.teamMemberId,
        reason: parsed.data.reason,
        deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
      },
      include: {
        teamMember: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });

    return reply.status(201).send(paste);
  });

  // Mark paste as delivered
  fastify.patch('/:pasteId/deliver', { onRequest: [fastify.authorize('PASTRY_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), pasteId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const paste = await prisma.paste.findUnique({
      where: { id: parsedParams.data.pasteId },
      include: { teamMember: true }
    });

    if (!paste || paste.teamMember.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Paste not found' });
    }

    const updatedPaste = await prisma.paste.update({
      where: { id: paste.id },
      data: {
        status: PasteStatus.DELIVERED,
        deliveredAt: new Date()
      },
      include: {
        teamMember: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });

    return reply.send(updatedPaste);
  });
}
