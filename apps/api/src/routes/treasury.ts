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
      where: { teamId: parsedParams.data.teamId, isActive: true }
    });

    return reply.send(rules);
  });

  fastify.post('/fine-rules', { onRequest: [fastify.authorize('FINE_RULE_MANAGE')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const ruleSchema = z.object({
      reason: z.string().min(1),
      defaultAmountCents: z.number().positive(),
    });

    const parsed = ruleSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const rule = await prisma.fineRule.create({
      data: {
        teamId: parsedParams.data.teamId,
        reason: parsed.data.reason,
        defaultAmountCents: parsed.data.defaultAmountCents,
      }
    });

    return reply.status(201).send(rule);
  });

  // Assign Fine
  fastify.post('/fines', { onRequest: [fastify.authorize('FINE_ASSIGN')] }, async (request, reply) => {
    const paramsSchema = z.object({ teamId: z.string() });
    const parsedParams = paramsSchema.safeParse(request.params);
    if (!parsedParams.success) return reply.status(400).send({ error: 'Invalid param' });

    const fineSchema = z.object({
      teamMemberId: z.string(),
      fineRuleId: z.string(),
    });

    const parsed = fineSchema.safeParse(request.body);
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid input' });

    const rule = await prisma.fineRule.findUnique({ where: { id: parsed.data.fineRuleId } });
    if (!rule) return reply.status(404).send({ error: 'Rule not found' });

    const fine = await prisma.fine.create({
      data: {
        teamMemberId: parsed.data.teamMemberId,
        fineRuleId: rule.id,
        reasonSnapshot: rule.reason,
        amountCents: rule.defaultAmountCents,
        issuedBy: request.user.id,
      }
    });

    return reply.status(201).send(fine);
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
