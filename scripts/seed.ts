import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, Role, EventType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏐 Inizializzazione seed database Neon VolleyStack...');

  // 1. Utente Coach / Admin
  const coachEmail = 'coach@volleystack.it';
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const coach = await prisma.user.upsert({
    where: { email: coachEmail },
    update: {
      passwordHash,
      name: 'Coach Marco',
    },
    create: {
      email: coachEmail,
      name: 'Coach Marco',
      passwordHash,
    },
  });
  console.log(`✅ Utente verificato: ${coach.email} (Password: Password123!)`);

  // 2. Squadra Demo
  let team = await prisma.team.findFirst({
    where: { name: 'Volley Roma Spikers' },
  });

  if (!team) {
    team = await prisma.team.create({
      data: {
        name: 'Volley Roma Spikers',
        joinCode: 'VOLLEY26',
        paypalLink: 'https://paypal.me/volleyroma',
      },
    });
    console.log(`✅ Squadra creata: ${team.name} (Codice invito: ${team.joinCode})`);
  } else {
    console.log(`✅ Squadra esistente: ${team.name} (Codice invito: ${team.joinCode})`);
  }

  // 3. Team Member & Roles
  let membership = await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: coach.id,
        teamId: team.id,
      },
    },
  });

  if (!membership) {
    membership = await prisma.teamMember.create({
      data: {
        userId: coach.id,
        teamId: team.id,
        isPlayer: true,
        shirtNumber: 1,
      },
    });
  }

  const rolesToAssign: Role[] = [Role.OWNER, Role.COACH, Role.TREASURER, Role.PLAYER];
  for (const role of rolesToAssign) {
    await prisma.teamMemberRole.upsert({
      where: {
        teamMemberId_role: {
          teamMemberId: membership.id,
          role,
        },
      },
      update: {},
      create: {
        teamMemberId: membership.id,
        role,
      },
    });
  }
  console.log('✅ Ruoli assegnati (OWNER, COACH, TREASURER, PLAYER)');

  // 4. Regolamento Multe / Tasse (FineRule)
  const defaultRules = [
    { reason: 'Ritardo allenamento (<15 min)', defaultAmountCents: 200, category: 'LATE' },
    { reason: 'Ritardo partita', defaultAmountCents: 500, category: 'LATE' },
    { reason: 'Dimenticanza maglia da gara', defaultAmountCents: 300, category: 'EQUIPMENT' },
    { reason: 'Dimenticanza borraccia / pallone', defaultAmountCents: 200, category: 'EQUIPMENT' },
    { reason: 'Assenza non comunicata', defaultAmountCents: 500, category: 'ABSENCE' },
    { reason: 'Cartellino giallo', defaultAmountCents: 200, category: 'DISCIPLINE' },
    { reason: 'Cartellino rosso', defaultAmountCents: 500, category: 'DISCIPLINE' },
    { reason: 'Epic Fail / Battuta clamorosa fuori', defaultAmountCents: 300, category: 'FUN' },
  ];

  for (const r of defaultRules) {
    const existing = await prisma.fineRule.findFirst({
      where: { teamId: team.id, reason: r.reason },
    });
    if (!existing) {
      await prisma.fineRule.create({
        data: {
          teamId: team.id,
          reason: r.reason,
          defaultAmountCents: r.defaultAmountCents,
        },
      });
    }
  }
  console.log('✅ Regolamento Cassa Multe configurato (8 regole standard)');

  // 5. Eventi Demo
  const eventCount = await prisma.event.count({ where: { teamId: team.id } });
  if (eventCount === 0) {
    const nextTuesday = new Date();
    nextTuesday.setDate(nextTuesday.getDate() + ((2 + 7 - nextTuesday.getDay()) % 7 || 7));
    nextTuesday.setHours(20, 30, 0, 0);

    const nextSaturday = new Date();
    nextSaturday.setDate(nextSaturday.getDate() + ((6 + 7 - nextSaturday.getDay()) % 7 || 7));
    nextSaturday.setHours(17, 0, 0, 0);

    await prisma.event.createMany({
      data: [
        {
          teamId: team.id,
          title: 'Allenamento Tattico e Ricezione',
          type: EventType.TRAINING,
          date: nextTuesday,
          location: 'Palazzetto dello Sport - Campo 1',
        },
        {
          teamId: team.id,
          title: 'Campionato: Volley Roma vs Virtus Sharks',
          type: EventType.MATCH,
          date: nextSaturday,
          location: 'Palazzetto Comunale (Trasferta)',
        },
      ],
    });
    console.log('✅ Eventi di prova creati (Allenamento e Partita)');
  }

  // 6. Annuncio di Benvenuto
  const announcementCount = await prisma.announcement.count({ where: { teamId: team.id } });
  if (announcementCount === 0) {
    await prisma.announcement.create({
      data: {
        teamId: team.id,
        authorId: membership.id,
        title: 'Benvenuti su VolleyStack! 🏐',
        content: 'La nuova piattaforma per gestire convocazioni, presenze, cassa multe e bacheca di squadra è attiva su Neon Database!',
      },
    });
    console.log('✅ Annuncio di benvenuto pubblicato');
  }

  console.log('\n🎉 Seed completato con successo su Neon PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('❌ Errore durante il seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
