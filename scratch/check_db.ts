import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });
import { prisma } from '../apps/api/src/lib/prisma';

async function main() {
  const userCount = await prisma.user.count();
  const teamCount = await prisma.team.count();
  const memberCount = await prisma.teamMember.count();
  const eventCount = await prisma.event.count();
  const attendanceCount = await prisma.attendance.count();
  const fineCount = await prisma.fine.count();
  const pasteCount = await prisma.paste.count();
  
  console.log('Database summary:', {
    userCount,
    teamCount,
    memberCount,
    eventCount,
    attendanceCount,
    fineCount,
    pasteCount,
  });

  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } });
  console.log('Existing users:', users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
