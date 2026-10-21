import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import z from 'zod';
import { prisma } from '../lib/prisma';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const registerSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    });

    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid input', details: parsed.error.format() });
    }

    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: "Quest'email è già in uso. Effettua il login o procedi con il recupero password." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return reply.status(201).send({ token, user: { id: user.id, email: user.email, name: user.name } });
  });

  fastify.post('/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid input' });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return reply.send({ token, user: { id: user.id, email: user.email, name: user.name } });
  });

  fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { memberships: { include: { team: true, roles: true } } }
    });
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return reply.send({ 
      id: user.id, 
      email: user.email, 
      name: user.name,
      memberships: user.memberships
    });
  });
}
