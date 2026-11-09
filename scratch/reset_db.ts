import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });
import { prisma } from '../apps/api/src/lib/prisma';

async function reset() {
  console.log('Resetting all tables...');
  
  await prisma.paymentAllocation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fine.deleteMany();
  await prisma.fineRule.deleteMany();
  await prisma.paste.deleteMany();
  await prisma.duty.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.event.deleteMany();
  await prisma.ledgerTransaction.deleteMany();
  await prisma.teamMemberRole.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database successfully cleared! All accounts and teams removed.');
  
  const userCount = await prisma.user.count();
  const teamCount = await prisma.team.count();
  console.log(`Verification: users=${userCount}, teams=${teamCount}`);
}

reset().catch(console.error).finally(() => prisma.$disconnect());

