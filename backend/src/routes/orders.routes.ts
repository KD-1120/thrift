// Orders Routes

import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

import { createOrderFormSchema } from '../../../src/validation/order.schema';

// Validation schemas
const updateStatusSchema = z.object({
  status: z.enum([
    'pending',
    'accepted',
    'confirmed',
    'in_progress',
    'ready_for_fitting',
    'completed',
    'cancelled',
  ]),
  notes: z.string().optional(),
});

const cancelOrderSchema = z.object({
  reason: z.string().optional(),
});

import { orders, incrementOrderId } from '../store/data';

export default async function ordersRoutes(fastify: FastifyInstance) {
  // Create new order
  fastify.post(
    '/',
    {
      preHandler: authenticate,
    },
    async (request: FastifyRequest, reply) => {
      const body = createOrderFormSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const orderId = `order_${incrementOrderId()}`;
      const now = new Date().toISOString();

      const order = {
        id: orderId,
        customerId: uid,
        tailorId: body.tailorId,
        status: 'pending',
        items: [
          {
            id: `item_${Date.now()}`,
            garmentType: body.garmentType,
            fabricType: body.fabricType,
            description: body.description,
            price: body.estimatedCost,
            quantity: 1,
          },
        ],
        measurements: body.customMeasurements || {},
        measurementId: body.measurementId,
        totalAmount: body.estimatedCost,
        referenceImages: body.referenceImages,
        specialInstructions: body.specialInstructions,
        createdAt: now,
        updatedAt: now,
      };

      orders.set(orderId, order);

      request.log.info(`Order created: ${orderId} by ${uid}`);

      return reply.code(201).send(order);
    }
  );

  // Get all orders with filters
  fastify.get('/', { preHandler: authenticate }, async (request: FastifyRequest) => {
    const { status, tailorId, customerId, page = '1', pageSize = '20' } = request.query as any;

    let filteredOrders = Array.from(orders.values());

    // Apply filters
    if (status) {
      filteredOrders = filteredOrders.filter((o) => o.status === status);
    }
    if (tailorId) {
      filteredOrders = filteredOrders.filter((o) => o.tailorId === tailorId);
    }
    if (customerId) {
      filteredOrders = filteredOrders.filter((o) => o.customerId === customerId);
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pageSize, 10);
    const startIndex = (pageNum - 1) * pageSizeNum;
    const endIndex = startIndex + pageSizeNum;

    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      data: paginatedOrders,
      total: filteredOrders.length,
      page: pageNum,
      pageSize: pageSizeNum,
      hasMore: endIndex < filteredOrders.length,
    };
  });

  // Get customer's orders
  fastify.get(
    '/customer/me',
    { preHandler: authenticate },
    async (request: FastifyRequest) => {
      const { uid } = (request as AuthenticatedRequest).user;

      const customerOrders = Array.from(orders.values())
        .filter((o) => o.customerId === uid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return customerOrders;
    }
  );

  // Get tailor's orders
  fastify.get(
    '/tailor/me',
    { preHandler: authenticate },
    async (request: FastifyRequest) => {
      const { uid } = (request as AuthenticatedRequest).user;
      const { status } = request.query as any;

      let tailorOrders = Array.from(orders.values()).filter((o) => o.tailorId === uid);

      if (status) {
        tailorOrders = tailorOrders.filter((o) => o.status === status);
      }

      tailorOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return tailorOrders;
    }
  );

  // Get order by ID
  fastify.get(
    '/:orderId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { orderId } = request.params as { orderId: string };
      const { uid } = (request as AuthenticatedRequest).user;

      const order = orders.get(orderId);

      if (!order) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // Check if user has access to this order
      if (order.customerId !== uid && order.tailorId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have access to this order',
        });
      }

      return order;
    }
  );

  // Update order status
  fastify.patch(
    '/:orderId/status',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { orderId } = request.params as { orderId: string };
      const body = updateStatusSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const order = orders.get(orderId);

      if (!order) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // Only tailor can update status
      if (order.tailorId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Only the tailor can update order status',
        });
      }

      order.status = body.status;
      order.updatedAt = new Date().toISOString();
      if (body.notes) {
        order.statusNotes = body.notes;
      }

      orders.set(orderId, order);

      request.log.info(`Order ${orderId} status updated to ${body.status}`);

      return order;
    }
  );

  // Cancel order
  fastify.post(
    '/:orderId/cancel',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { orderId } = request.params as { orderId: string };
      const body = cancelOrderSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const order = orders.get(orderId);

      if (!order) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // Only customer can cancel
      if (order.customerId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Only the customer can cancel the order',
        });
      }

      // Can't cancel completed orders
      if (order.status === 'completed') {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Cannot cancel completed orders',
        });
      }

      order.status = 'cancelled';
      order.cancelReason = body.reason;
      order.updatedAt = new Date().toISOString();

      orders.set(orderId, order);

      request.log.info(`Order ${orderId} cancelled by ${uid}`);

      return order;
    }
  );

  // Add order notes
  fastify.post(
    '/:orderId/notes',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { orderId } = request.params as { orderId: string };
      const { note } = z.object({ note: z.string() }).parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const order = orders.get(orderId);

      if (!order) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      if (!order.notes) {
        order.notes = [];
      }

      order.notes.push({
        userId: uid,
        note,
        createdAt: new Date().toISOString(),
      });

      order.updatedAt = new Date().toISOString();
      orders.set(orderId, order);

      return reply.code(201).send({ message: 'Note added successfully' });
    }
  );

  // Add order images
  fastify.post(
    '/:orderId/images',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { orderId } = request.params as { orderId: string };
      const { images } = z.object({ images: z.array(z.string()) }).parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const order = orders.get(orderId);

      if (!order) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // Only order participants can add images
      if (order.customerId !== uid && order.tailorId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have access to this order',
        });
      }

      if (!order.additionalImages) {
        order.additionalImages = [];
      }

      order.additionalImages.push(...images);
      order.updatedAt = new Date().toISOString();
      orders.set(orderId, order);

      return reply.code(201).send({ message: 'Images added successfully' });
    }
  );
}
