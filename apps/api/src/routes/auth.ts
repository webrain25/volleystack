import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import z from 'zod';
import crypto from 'crypto';
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

  // Facebook OAuth Login & Registration
  fastify.post('/facebook', async (request, reply) => {
    const fbSchema = z.object({
      code: z.string().min(1, 'Codice obbligatorio'),
      redirectUri: z.string().url('Redirect URI non valido'),
    });

    const parsed = fbSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Codice di autorizzazione Facebook mancante o non valido' });
    }

    const { code, redirectUri } = parsed.data;
    const appId = process.env.FACEBOOK_APP_ID || '28923588113936792';
    const appSecret = process.env.FACEBOOK_APP_SECRET || '6a72985bd22007e4c7992248950f5a2b';

    try {
      // 1. Exchange authorization code for Facebook access token
      const tokenUrl = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${encodeURIComponent(code)}`;
      const tokenRes = await fetch(tokenUrl);
      const tokenData: any = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.access_token) {
        fastify.log.error(tokenData, 'Facebook token exchange failed');
        return reply.status(400).send({ 
          error: tokenData.error?.message || 'Impossibile completare il login con Facebook. Codice scaduto o autorizzazione rifiutata.' 
        });
      }

      // 2. Fetch user profile from Facebook Graph API
      const profileUrl = `https://graph.facebook.com/v20.0/me?fields=id,name,first_name,last_name,email,picture.type(large)&access_token=${tokenData.access_token}`;
      const profileRes = await fetch(profileUrl);
      const fbUser: any = await profileRes.json();

      if (!profileRes.ok || !fbUser.id) {
        fastify.log.error(fbUser, 'Facebook profile fetch failed');
        return reply.status(400).send({ error: 'Impossibile ottenere i dati del profilo da Facebook.' });
      }

      // 3. Email resolution (fallback if user registered on FB with phone only)
      const email = fbUser.email || `fb_${fbUser.id}@facebook.volleystack.com`;
      const name = fbUser.name || [fbUser.first_name, fbUser.last_name].filter(Boolean).join(' ') || 'Atleta Volley';
      const lastName = fbUser.last_name || null;
      const avatarUrl = fbUser.picture?.data?.url || null;

      // 4. Find existing user or create a new one in Neon Postgres
      let user = await prisma.user.findUnique({
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
        const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);
        user = await prisma.user.create({
          data: {
            email,
            name,
            lastName,
            avatarUrl,
            passwordHash,
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
      } else {
        // Account unificato (Merge intelligente):
        // Se l'utente si era già registrato con la stessa email, unifichiamo l'account
        // aggiornando foto profilo o dati mancanti senza duplicare l'account
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: user.avatarUrl || avatarUrl,
            name: user.name || name,
            lastName: user.lastName || lastName,
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
    } catch (err: any) {
      fastify.log.error(err, 'Unhandled Facebook auth error');
      return reply.status(500).send({ error: 'Errore interno durante il login con Facebook. Riprova tra poco.' });
    }
  });

  // Google OAuth 2.0 Exchange & Login
  fastify.post('/google', async (request, reply) => {
    const schema = z.object({
      code: z.string(),
      redirectUri: z.string().url(),
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Codice di autorizzazione Google mancante o non valido.' });
    }

    const { code, redirectUri } = parsed.data;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return reply.status(500).send({ 
        error: 'Integrazione Google non ancora configurata sul server (GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET mancante).' 
      });
    }

    try {
      // 1. Exchange code for tokens with Google OAuth
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData: any = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        fastify.log.error(tokenData, 'Google token exchange failed');
        return reply.status(400).send({
          error: tokenData.error_description || 'Impossibile completare il login con Google. Codice scaduto o rifiutato.',
        });
      }

      // 2. Fetch user profile from Google UserInfo
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const googleUser: any = await profileRes.json();

      if (!profileRes.ok || !googleUser.email) {
        fastify.log.error(googleUser, 'Google userinfo fetch failed');
        return reply.status(400).send({ error: 'Impossibile ottenere i dati del profilo Google.' });
      }

      const email = googleUser.email.toLowerCase();
      const name = googleUser.name || googleUser.given_name || 'Atleta Volley';
      const lastName = googleUser.family_name || null;
      const avatarUrl = googleUser.picture || null;

      // 3. Find or create/merge user in Neon Postgres
      let user = await prisma.user.findUnique({
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
        const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);
        user = await prisma.user.create({
          data: {
            email,
            name,
            lastName,
            avatarUrl,
            passwordHash,
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
      } else {
        // Smart merge
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: user.avatarUrl || avatarUrl,
            name: user.name || name,
            lastName: user.lastName || lastName,
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
    } catch (err: any) {
      fastify.log.error(err, 'Unhandled Google auth error');
      return reply.status(500).send({ error: 'Errore interno durante il login con Google. Riprova tra poco.' });
    }
  });
}
