import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import z from 'zod';
import { prisma } from '../lib/prisma';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const registerSchema = z.object({
      email: z.string().email('Inserisci un indirizzo email valido'),
      password: z.string().min(6, 'La password deve contenere almeno 6 caratteri'),
      name: z.string().min(1, 'Il nome è obbligatorio'),
      lastName: z.string().optional().nullable(),
      birthDate: z.string().optional().nullable(),
    });

    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      const firstError = Object.values(parsed.error.format())[0];
      const message = typeof firstError === 'object' && '_errors' in firstError && firstError._errors[0]
        ? firstError._errors[0]
        : 'Dati inseriti non validi';
      return reply.status(400).send({ error: message, details: parsed.error.format() });
    }

    const { email, password, name, lastName, birthDate } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: "Quest'email è già in uso. Effettua il login o procedi con il recupero password." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const fullName = [name.trim(), lastName?.trim()].filter(Boolean).join(' ');
    const parsedBirthDate = birthDate ? new Date(birthDate) : null;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: fullName || name.trim(),
        lastName: lastName?.trim() || null,
        birthDate: parsedBirthDate && !isNaN(parsedBirthDate.getTime()) ? parsedBirthDate : null,
      },
      include: {
        memberships: {
          include: {
            team: true,
            roles: true,
          },
        },
      },
    });

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return reply.status(201).send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        birthDate: user.birthDate,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        memberships: user.memberships || [],
      },
    });
  });

  fastify.post('/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Input non valido' });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            team: true,
            roles: true,
          },
        },
      },
    });
    if (!user) {
      return reply.status(401).send({ error: 'Credenziali non valide' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: 'Credenziali non valide' });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        birthDate: user.birthDate,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        memberships: user.memberships || [],
      },
    });
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
      lastName: user.lastName,
      birthDate: user.birthDate,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      memberships: user.memberships
    });
  });
}
