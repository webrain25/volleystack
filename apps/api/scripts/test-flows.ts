import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000';

async function login(email: string, password = 'password123') {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data.token;
}

async function runTests() {
  console.log('Starting automated tests for Role/Permission logic...\n');

  try {
    const ownerToken = await login('lucatest1@owner.com');
    const playerToken = await login('lucatest1@player.com');
    const treasurerToken = await login('lucatest1@treasurer.com');

    const team = await prisma.team.findFirst();
    if (!team) throw new Error('No team found');
    
    const ownerMember = await prisma.teamMember.findFirst({ where: { teamId: team.id, user: { email: 'lucatest1@owner.com' } } });
    const playerMember = await prisma.teamMember.findFirst({ where: { teamId: team.id, user: { email: 'lucatest1@player.com' } } });

    console.log('Test 1: Player tries to assign a Paste (Should FAIL with 403)');
    try {
      await axios.post(`${API_URL}/teams/${team.id}/pastes`, {
        teamMemberId: ownerMember!.id,
        reason: 'Late to training',
        deadline: new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${playerToken}` } });
      console.log('❌ FAIL: Player assigned Paste successfully!');
    } catch (err: any) {
      if (err.response?.status === 403) console.log('✅ PASS: Player denied from assigning Paste');
      else console.log('❌ FAIL: Unexpected error', err.response?.status);
    }

    console.log('\nTest 2: Owner assigns a Paste to Player (Should PASS)');
    try {
      await axios.post(`${API_URL}/teams/${team.id}/pastes`, {
        teamMemberId: playerMember!.id,
        reason: 'Late to training',
        deadline: new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${ownerToken}` } });
      console.log('✅ PASS: Owner assigned Paste');
    } catch (err: any) {
      console.log('❌ FAIL: Owner could not assign Paste', err.response?.data);
    }

    console.log('\nTest 3: Owner creates a fine rule and assigns fine to Player');
    let ruleId;
    try {
      const ruleRes = await axios.post(`${API_URL}/teams/${team.id}/fine-rules`, {
        reason: 'Forgot shoes',
        defaultAmountCents: 500
      }, { headers: { Authorization: `Bearer ${ownerToken}` } });
      ruleId = ruleRes.data.id;
      
      await axios.post(`${API_URL}/teams/${team.id}/fines`, {
        teamMemberId: playerMember!.id,
        fineRuleId: ruleId
      }, { headers: { Authorization: `Bearer ${ownerToken}` } });
      console.log('✅ PASS: Fine rule and fine created');
    } catch (err: any) {
      console.log('❌ FAIL: Could not create fine', err.response?.data);
    }

    console.log('\nTest 4: Player declares payment for fine (Should be PENDING)');
    let paymentId;
    try {
      const payRes = await axios.post(`${API_URL}/teams/${team.id}/payments/declarations`, {
        amountCents: 500,
        method: 'CASH'
      }, { headers: { Authorization: `Bearer ${playerToken}` } });
      paymentId = payRes.data.id;
      if (payRes.data.status === 'PENDING') console.log('✅ PASS: Payment declared and is PENDING');
      else console.log('❌ FAIL: Payment is not PENDING');
    } catch (err: any) {
      console.log('❌ FAIL: Could not declare payment', err.response?.data);
    }

    console.log('\nTest 5: Treasurer confirms payment (Should allocate and mark fine PAID)');
    try {
      await axios.patch(`${API_URL}/teams/${team.id}/payments/${paymentId}/confirm`, {}, 
      { headers: { Authorization: `Bearer ${treasurerToken}` } });
      
      const fines = await prisma.fine.findMany({ where: { teamMemberId: playerMember!.id, reasonSnapshot: 'Forgot shoes' }, orderBy: { issuedAt: 'desc' } });
      if (fines[0].status === 'PAID') {
        console.log('✅ PASS: Treasurer confirmed and Fine was auto-allocated as PAID!');
      } else {
        console.log('❌ FAIL: Fine is still UNPAID after confirmation');
      }
    } catch (err: any) {
      console.log('❌ FAIL: Treasurer could not confirm payment', err.response?.data);
    }

  } catch (err: any) {
    console.error('Fatal error in tests:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
