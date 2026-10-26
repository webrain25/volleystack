import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function profileRoutes(fastify: FastifyInstance) {
  // Get current user profile
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
      }
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send(user);
  });

  // Update profile
  fastify.patch('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      avatarUrl: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
    });

    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid input' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: request.user.id },
      data: parsed.data,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
      }
    });

    return reply.send(updatedUser);
  });

  // Change password
  fastify.post('/change-password', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const passwordSchema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
    });

    const parsed = passwordSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid input' });
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: request.user.id } });
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return reply.status(401).send({ error: 'La password attuale non è corretta.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: request.user.id },
      data: { passwordHash }
    });

    return reply.send({ success: true });
  });
}
