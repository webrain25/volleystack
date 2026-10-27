import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '../../.env' });

import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import authRoutes from './routes/auth';
import teamRoutes from './routes/teams';
import eventRoutes from './routes/events';
import treasuryRoutes from './routes/treasury';
import pasteRoutes from './routes/pastes';
import announcementRoutes from './routes/announcements';
import profileRoutes from './routes/profile';
import aiRoutes from './routes/ai';
import { Permission, hasPermission } from './lib/permissions';
import { prisma } from './lib/prisma';
import { Role } from '@prisma/client';

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o: string) => o.trim()) : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret123',
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (permission: Permission) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; email: string };
    user: { id: string; email: string };
  }
}

server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

server.decorate('authorize', function (permission: Permission) {
  return async function (request: FastifyRequest<any>, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      const teamId = (request.params as any)?.teamId;
      if (!teamId) {
        return reply.status(400).send({ error: 'teamId is required for authorization' });
      }

      const membership = await prisma.teamMember.findUnique({
        where: { userId_teamId: { userId: request.user.id, teamId } },
        include: { roles: true }
      });

      if (!membership) {
        return reply.status(403).send({ error: 'Not a member of this team' });
      }

      const roles = membership.roles.map(r => r.role);
      if (!hasPermission(roles, permission)) {
        return reply.status(403).send({ error: `Forbidden: requires ${permission}` });
      }
    } catch (err) {
      reply.send(err);
    }
  };
});

server.register(authRoutes, { prefix: '/auth' });
server.register(profileRoutes, { prefix: '/profile' });
server.register(teamRoutes, { prefix: '/teams' });
server.register(eventRoutes, { prefix: '/teams/:teamId/events' });
server.register(treasuryRoutes, { prefix: '/teams/:teamId' });
server.register(pasteRoutes, { prefix: '/teams/:teamId/pastes' });
server.register(announcementRoutes, { prefix: '/teams/:teamId/announcements' });
server.register(aiRoutes, { prefix: '/teams/:teamId/ai' });

server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
