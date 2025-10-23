import { FastifyInstance } from 'fastify';
import { initializePayment, verifyPayment, releasePayment, refundPayment } from '../services/payments.service';

export default async function (fastify: FastifyInstance) {
  fastify.post('/payments/initialize', initializePayment);
  fastify.post('/payments/verify', verifyPayment);
  fastify.post('/payments/:orderId/release', releasePayment);
  fastify.post('/payments/:orderId/refund', refundPayment);
}
