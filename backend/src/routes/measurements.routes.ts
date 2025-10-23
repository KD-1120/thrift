// Measurements Routes

import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';

// Validation schemas
const createMeasurementSchema = z.object({
  name: z.string().min(2),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  shoulders: z.number().positive().optional(),
  armLength: z.number().positive().optional(),
  inseam: z.number().positive().optional(),
  neck: z.number().positive().optional(),
  custom: z.record(z.number()).optional(),
});

const updateMeasurementSchema = createMeasurementSchema.partial();

import { measurements, incrementMeasurementId } from '../store/data';

export default async function measurementsRoutes(fastify: FastifyInstance) {
  // Get all measurements for current user
  fastify.get(
    '/',
    { preHandler: authenticate },
    async (request: FastifyRequest) => {
      const { uid } = (request as AuthenticatedRequest).user;

      const userMeasurements = Array.from(measurements.values())
        .filter((m) => m.userId === uid)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return userMeasurements;
    }
  );

  // Create new measurement
  fastify.post(
    '/',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const body = createMeasurementSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const measurementId = `measurement_${incrementMeasurementId()}`;
      const now = new Date().toISOString();

      const measurement = {
        id: measurementId,
        userId: uid,
        name: body.name,
        chest: body.chest,
        waist: body.waist,
        hips: body.hips,
        shoulders: body.shoulders,
        armLength: body.armLength,
        inseam: body.inseam,
        neck: body.neck,
        custom: body.custom,
        createdAt: now,
        updatedAt: now,
      };

      measurements.set(measurementId, measurement);

      request.log.info(`Measurement created: ${measurementId} for user ${uid}`);

      return reply.code(201).send(measurement);
    }
  );

  // Get measurement by ID
  fastify.get(
    '/:measurementId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { measurementId } = request.params as { measurementId: string };
      const { uid } = (request as AuthenticatedRequest).user;

      const measurement = measurements.get(measurementId);

      if (!measurement) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Measurement not found',
        });
      }

      // Check ownership
      if (measurement.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have access to this measurement',
        });
      }

      return measurement;
    }
  );

  // Update measurement
  fastify.put(
    '/:measurementId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { measurementId } = request.params as { measurementId: string };
      const body = updateMeasurementSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const measurement = measurements.get(measurementId);

      if (!measurement) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Measurement not found',
        });
      }

      // Check ownership
      if (measurement.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have access to this measurement',
        });
      }

      // Update fields
      Object.assign(measurement, body, {
        updatedAt: new Date().toISOString(),
      });

      measurements.set(measurementId, measurement);

      request.log.info(`Measurement updated: ${measurementId}`);

      return measurement;
    }
  );

  // Delete measurement
  fastify.delete(
    '/:measurementId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { measurementId } = request.params as { measurementId: string };
      const { uid } = (request as AuthenticatedRequest).user;

      const measurement = measurements.get(measurementId);

      if (!measurement) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Measurement not found',
        });
      }

      // Check ownership
      if (measurement.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have access to this measurement',
        });
      }

      measurements.delete(measurementId);

      request.log.info(`Measurement deleted: ${measurementId}`);

      return reply.code(204).send();
    }
  );
}
