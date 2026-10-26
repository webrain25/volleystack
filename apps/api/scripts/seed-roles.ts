import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding role accounts...');

  // Find the first team to add these users to (or demo team)
  const team = await prisma.team.findFirst();
  if (!team) {
    console.error('No team found! Cannot add users.');
    process.exit(1);
  }

  console.log(`Adding users to team: ${team.name} (${team.id})`);

  const rolesToCreate = [
    { email: 'lucatest1@admin.com', name: 'Luca Owner', role: Role.ADMIN },
    { email: 'lucatest1@admin.com', name: 'Luca Admin', role: Role.ADMIN },
    { email: 'lucatest1@captain.com', name: 'Luca Captain', role: Role.CAPTAIN },
    { email: 'lucatest1@vice.com', name: 'Luca Vice', role: Role.VICE_CAPTAIN },
    { email: 'lucatest1@coach.com', name: 'Luca Coach', role: Role.COACH },
    { email: 'lucatest1@treasurer.com', name: 'Luca Treasurer', role: Role.TREASURER },
    { email: 'lucatest1@player.com', name: 'Luca Player', role: Role.PLAYER },
  ];

  const passwordHash = await bcrypt.hash('password123', 10);

  for (const rc of rolesToCreate) {
    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: rc.email },
      update: {},
      create: {
        email: rc.email,
        name: rc.name,
        passwordHash: passwordHash,
      }
    });

    // Check if membership exists
    let membership = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: user.id, teamId: team.id } }
    });

    if (!membership) {
      membership = await prisma.teamMember.create({
        data: {
          userId: user.id,
          teamId: team.id,
        }
      });
    }

    // Add role
    const existingRole = await prisma.teamMemberRole.findFirst({
      where: { teamMemberId: membership.id, role: rc.role }
    });

    if (!existingRole) {
      await prisma.teamMemberRole.create({
        data: {
          teamMemberId: membership.id,
          role: rc.role,
        }
      });
    }

    console.log(`Created/Verified user: ${rc.email} with role ${rc.role} (password123)`);
  }

  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
