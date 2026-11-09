import { FastifyInstance } from 'fastify';
import z from 'zod';
import { prisma } from '../lib/prisma';
import { PaymentMethod, PaymentStatus, FineStatus } from '@prisma/client';

export default async function treasuryRoutes(fastify: FastifyInstance) {
  async function allocatePaymentToFines(paymentId: string, teamMemberId: string, amountCents: number) {
    const unpaidFines = await prisma.fine.findMany({
      where: { teamMemberId, status: FineStatus.UNPAID },
      include: { allocations: true },
      orderBy: { issuedAt: 'asc' }
    });

    let remaining = amountCents;
    for (const fine of unpaidFines) {
      if (remaining <= 0) break;
      
      const paidSoFar = fine.allocations.reduce((acc, a) => acc + a.amountCents, 0);
      const amountLeftToPay = fine.amountCents - paidSoFar;
      
      if (amountLeftToPay <= 0) {
        await prisma.fine.update({ where: { id: fine.id }, data: { status: FineStatus.PAID } });
        continue;
      }

      const amountToAllocate = Math.min(remaining, amountLeftToPay);
      
      await prisma.paymentAllocation.create({
        data: {
          paymentId,
          fineId: fine.id,
          amountCents: amountToAllocate
        }
      });
      
      if (amountToAllocate === amountLeftToPay) {
        await prisma.fine.update({ where: { id: fine.id }, data: { status: FineStatus.PAID } });
      }
      
      remaining -= amountToAllocate;
    }
  }

  // Fine Rules
  fastify.get('/fine-rules', { onRequest: [fastify.authorize('FINE_VIEW_SELF')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const rules = await prisma.fineRule.findMany({
      where: { teamId: parsedParams.data.teamId, isActive: true },
      orderBy: { defaultAmountCents: 'asc' }
    });

    return reply.send(rules);
  });

  fastify.post('/fine-rules', { onRequest: [fastify.authorize('FINE_RULE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const ruleSchema = z.object({
      reason: z.string().min(1),
      defaultAmountCents: z.number().int().positive(),
    });

    const parsed = ruleSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const rule = await prisma.fineRule.create({
      data: {
        teamId: parsedParams.data.teamId,
        reason: parsed.data.reason.trim(),
        defaultAmountCents: parsed.data.defaultAmountCents,
      }
    });

    return reply.status(201).send(rule);
  });

  // Seed standard preset volleyball fine rules into team
  fastify.post('/fine-rules/seed-presets', { onRequest: [fastify.authorize('FINE_RULE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const { teamId } = parsedParams.data;

    const PRESET_RULES = [
      { reason: 'Ritardo Allenamento', defaultAmountCents: 100 },
      { reason: 'Ritardo Ritrovo Gara (1h 15m prima)', defaultAmountCents: 200 },
      { reason: 'Cartellino Giallo / Rosso', defaultAmountCents: 300 },
      { reason: 'Battuta Sotto la Rete', defaultAmountCents: 100 },
      { reason: 'Rigore Sbagliato (Slash non chiuso)', defaultAmountCents: 150 },
      { reason: 'Uso del Telefono in Palestra', defaultAmountCents: 200 },
      { reason: 'Indumento o Materiale Dimenticato', defaultAmountCents: 150 },
      { reason: 'Documento Gara Assente', defaultAmountCents: 500 },
      { reason: 'Cibo Non Autorizzato in Palestra', defaultAmountCents: 200 },
      { reason: 'Fumo in Palestra / Impianto', defaultAmountCents: 500 },
      { reason: 'Mancato Saldo Multe Entro 7gg', defaultAmountCents: 200 },
    ];

    const existing = await prisma.fineRule.findMany({ where: { teamId } });
    const existingReasons = new Set(existing.map((r) => r.reason.trim().toLowerCase()));

    const toCreate = PRESET_RULES.filter((p) => !existingReasons.has(p.reason.trim().toLowerCase()));

    if (toCreate.length > 0) {
      await prisma.fineRule.createMany({
        data: toCreate.map((p) => ({
          teamId,
          reason: p.reason,
          defaultAmountCents: p.defaultAmountCents,
          isActive: true
        }))
      });
    }

    const allRules = await prisma.fineRule.findMany({
      where: { teamId, isActive: true },
      orderBy: { defaultAmountCents: 'asc' }
    });

    return reply.status(201).send(allRules);
  });

  // Update fine rule
  fastify.patch('/fine-rules/:ruleId', { onRequest: [fastify.authorize('FINE_RULE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), ruleId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const updateSchema = z.object({
      reason: z.string().min(1).optional(),
      defaultAmountCents: z.number().int().positive().optional(),
      isActive: z.boolean().optional(),
    });

    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const rule = await prisma.fineRule.findUnique({ where: { id: parsedParams.data.ruleId } });
    if (!rule || rule.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Regola non trovata' });
    }

    const updated = await prisma.fineRule.update({
      where: { id: rule.id },
      data: parsed.data
    });

    return reply.send(updated);
  });

  // Delete / deactivate fine rule
  fastify.delete('/fine-rules/:ruleId', { onRequest: [fastify.authorize('FINE_RULE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), ruleId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const rule = await prisma.fineRule.findUnique({ where: { id: parsedParams.data.ruleId } });
    if (!rule || rule.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Regola non trovata' });
    }

    await prisma.fineRule.update({
      where: { id: rule.id },
      data: { isActive: false }
    });

    return reply.send({ success: true });
  });

  // Assign Fine (Customizable Reason, Amount, and Match 2x Multiplier)
  fastify.post('/fines', { onRequest: [fastify.authorize('FINE_ASSIGN')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const fineSchema = z.object({
      teamMemberId: z.string(),
      fineRuleId: z.string().optional(),
      reason: z.string().min(1).optional(),
      amountCents: z.number().int().positive().optional(),
      isMatchDouble: z.boolean().optional(),
    });

    const parsed = fineSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const { teamId } = parsedParams.data;
    let ruleId = parsed.data.fineRuleId;
    let finalReason = parsed.data.reason?.trim();
    let finalAmount = parsed.data.amountCents;

    if (ruleId) {
      const rule = await prisma.fineRule.findUnique({ where: { id: ruleId } });
      if (!rule || rule.teamId !== teamId) return reply.status(404).send({ error: 'Rule not found' });
      if (!finalReason) finalReason = rule.reason;
      if (!finalAmount) finalAmount = rule.defaultAmountCents;
    } else {
      // Find or create a generic custom rule for this team
      let customRule = await prisma.fineRule.findFirst({
        where: { teamId, reason: 'Sanzione Personalizzata' }
      });
      if (!customRule) {
        customRule = await prisma.fineRule.create({
          data: {
            teamId,
            reason: 'Sanzione Personalizzata',
            defaultAmountCents: finalAmount || 100,
            isActive: true
          }
        });
      }
      ruleId = customRule.id;
      if (!finalReason) finalReason = 'Sanzione Spogliatoio';
      if (!finalAmount) finalAmount = 100;
    }

    // Apply match double multiplier if requested
    if (parsed.data.isMatchDouble) {
      if (!finalReason.includes('[Gara ×2]')) {
        finalReason = `${finalReason} [Gara ×2]`;
      }
    }

    const fine = await prisma.fine.create({
      data: {
        teamMemberId: parsed.data.teamMemberId,
        fineRuleId: ruleId,
        reasonSnapshot: finalReason,
        amountCents: finalAmount,
        issuedBy: request.user.id,
      },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } },
        fineRule: true
      }
    });

    return reply.status(201).send(fine);
  });

  // Update existing fine (e.g. edit reason, modify amount, or change status)
  fastify.patch('/fines/:fineId', { onRequest: [fastify.authorize('FINE_ASSIGN')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), fineId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const updateSchema = z.object({
      reasonSnapshot: z.string().min(1).optional(),
      amountCents: z.number().int().positive().optional(),
      status: z.nativeEnum(FineStatus).optional(),
    });

    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const fine = await prisma.fine.findUnique({
      where: { id: parsedParams.data.fineId },
      include: { teamMember: true }
    });

    if (!fine || fine.teamMember.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Multa non trovata' });
    }

    const updated = await prisma.fine.update({
      where: { id: fine.id },
      data: parsed.data,
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } },
        fineRule: true
      }
    });

    return reply.send(updated);
  });

  // Delete / cancel existing fine
  fastify.delete('/fines/:fineId', { onRequest: [fastify.authorize('FINE_ASSIGN')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), fineId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const fine = await prisma.fine.findUnique({
      where: { id: parsedParams.data.fineId },
      include: { teamMember: true, allocations: true }
    });

    if (!fine || fine.teamMember.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Multa non trovata' });
    }

    if (fine.allocations.length > 0) {
      await prisma.paymentAllocation.deleteMany({ where: { fineId: fine.id } });
    }

    await prisma.fine.delete({ where: { id: fine.id } });
    return reply.send({ success: true });
  });

  // Declare Payment
  fastify.post('/payments/declarations', { onRequest: [fastify.authorize('PAYMENT_DECLARE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const declarationSchema = z.object({
      amountCents: z.number().positive(),
      method: z.nativeEnum(PaymentMethod),
    });

    const parsed = declarationSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const membership = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId: request.user.id, teamId: parsedParams.data.teamId } },
      include: { roles: true }
    });

    if (!membership) return reply.status(403).send({ error: 'Forbidden' });

    const isManager = membership.roles.some(r => ['ADMIN', 'ADMIN', 'TREASURER'].includes(r.role));

    const payment = await prisma.payment.create({
      data: {
        teamId: parsedParams.data.teamId,
        teamMemberId: membership.id,
        amountCents: parsed.data.amountCents,
        method: parsed.data.method,
        status: isManager ? PaymentStatus.CONFIRMED : PaymentStatus.PENDING,
        confirmedAt: isManager ? new Date() : null,
      }
    });

    if (isManager) {
      await allocatePaymentToFines(payment.id, membership.id, payment.amountCents);
    }

    return reply.status(201).send(payment);
  });

  // Get All Fines
  fastify.get('/fines', { onRequest: [fastify.authorize('FINE_VIEW_ALL')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const fines = await prisma.fine.findMany({
      where: { teamMember: { teamId: parsedParams.data.teamId } },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } },
        fineRule: true
      },
      orderBy: { issuedAt: 'desc' }
    });

    return reply.send(fines);
  });

  // Get All Payments
  fastify.get('/payments', { onRequest: [fastify.authorize('PAYMENT_VIEW_ALL')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const payments = await prisma.payment.findMany({
      where: { teamId: parsedParams.data.teamId },
      include: {
        teamMember: { include: { user: { select: { id: true, name: true, email: true } } } }
      },
      orderBy: { declaredAt: 'desc' }
    });

    return reply.send(payments);
  });

  // Confirm Payment
  fastify.patch('/payments/:paymentId/confirm', { onRequest: [fastify.authorize('PAYMENT_CONFIRM')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string(), paymentId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const payment = await prisma.payment.findUnique({
      where: { id: parsedParams.data.paymentId }
    });

    if (!payment || payment.teamId !== parsedParams.data.teamId) {
      return reply.status(404).send({ error: 'Payment not found' });
    }

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.CONFIRMED,
        confirmedAt: new Date(),
      }
    });

    await allocatePaymentToFines(payment.id, payment.teamMemberId, payment.amountCents);

    return reply.send(updated);
  });

  // Get Ledger Transactions
  fastify.get('/ledger', { onRequest: [fastify.authorize('CASH_VIEW')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const transactions = await prisma.ledgerTransaction.findMany({
      where: { teamId: parsedParams.data.teamId },
      orderBy: { date: 'desc' }
    });

    return reply.send(transactions);
  });

  // Create Ledger Transaction
  fastify.post('/ledger', { onRequest: [fastify.authorize('CASH_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const ledgerSchema = z.object({
      type: z.enum(['INCOME', 'EXPENSE']),
      amountCents: z.number().positive(),
      description: z.string().min(1)
    });

    const parsed = ledgerSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const transaction = await prisma.ledgerTransaction.create({
      data: {
        teamId: parsedParams.data.teamId,
        type: parsed.data.type,
        amountCents: parsed.data.amountCents,
        description: parsed.data.description
      }
    });

    return reply.status(201).send(transaction);
  });
}
