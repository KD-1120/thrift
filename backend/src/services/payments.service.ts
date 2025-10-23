import { FastifyRequest, FastifyReply } from 'fastify';
import Paystack from 'paystack-api';
import { orders } from '../store/data';

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export const initializePayment = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { orderId } = request.body as { orderId: string };
    const order = orders.get(orderId);

    if (!order) {
      return reply.code(404).send({ error: 'Order not found' });
    }

    const response = await paystack.transaction.initialize({
      amount: order.totalAmount * 100, // Paystack expects the amount in kobo
      email: 'customer@example.com', // TODO: Get customer email from order
      metadata: {
        orderId: order.id,
      },
    });

    order.status = 'payment_pending';
    orders.set(orderId, order);

    reply.send(response.data);
  } catch (error) {
    reply.status(500).send({ error: 'An error occurred while initializing payment' });
  }
};

import crypto from 'crypto';

export const verifyPayment = async (request: FastifyRequest, reply: FastifyReply) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(request.body))
    .digest('hex');

  if (hash !== request.headers['x-paystack-signature']) {
    return reply.code(401).send({ error: 'Invalid signature' });
  }

  const event = request.body as any;

  if (event.event === 'charge.success') {
    const orderId = event.data.metadata.orderId;
    const order = orders.get(orderId);

    if (order) {
      order.status = 'paid';
      orders.set(orderId, order);
    }
  }

  reply.status(200).send();
};

export const releasePayment = async (request: FastifyRequest, reply: FastifyReply) => {
  // TODO: Implement payment release logic
  reply.send({ message: 'Payment release endpoint' });
};

export const refundPayment = async (request: FastifyRequest, reply: FastifyReply) => {
  // TODO: Implement payment refund logic
  reply.send({ message: 'Payment refund endpoint' });
};
