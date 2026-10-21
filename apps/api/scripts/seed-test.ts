import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test data...');
  
  // Create User
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@volleystack.it' },
    update: {},
    create: {
      email: 'demo@volleystack.it',
      name: 'Utente Demo',
      passwordHash,
    },
  });
  console.log(`User created: ${user.email} / password123`);

  // Create Team
  const team = await prisma.team.create({
    data: {
      name: 'VolleyStack Pro Team',
      joinCode: 'DEMO12',
    }
  });
  console.log(`Team created: ${team.name}`);

  // Add User to Team as OWNER
  await prisma.teamMember.create({
    data: {
      userId: user.id,
      teamId: team.id,
      roles: {
        create: {
          role: 'ADMIN'
        }
      }
    }
  });

  // Create some events
  await prisma.event.createMany({
    data: [
      {
        teamId: team.id,
        title: 'Allenamento Serale',
        type: 'TRAINING',
        date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        location: 'Palazzetto dello Sport'
      },
      {
        teamId: team.id,
        title: 'Partita di Campionato',
        type: 'MATCH',
        date: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
        location: 'Palestra Comunale'
      }
    ]
  });

  // Create some fine rules
  await prisma.fineRule.createMany({
    data: [
      {
        teamId: team.id,
        reason: 'Ritardo allenamento (>10 min)',
        defaultAmountCents: 250 // 2.50
      },
      {
        teamId: team.id,
        reason: 'Assenza ingiustificata',
        defaultAmountCents: 500 // 5.00
      },
      {
        teamId: team.id,
        reason: 'Maglia dimenticata',
        defaultAmountCents: 100 // 1.00
      }
    ]
  });

  console.log('Test data seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
