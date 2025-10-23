// Tailors Routes

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  tailors,
  tailorReviews,
  TailorProfile,
  TailorReview,
} from '../store/data';

const locationUpdateSchema = z
  .object({
    address: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .partial()
      .optional(),
  })
  .partial();

const updateTailorSchema = z.object({
  businessName: z.string().min(2).optional(),
  description: z.string().optional(),
  avatar: z.string().url().nullable().optional(),
  specialties: z.array(z.string()).optional(),
  location: locationUpdateSchema.optional(),
  priceRange: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .partial()
    .optional(),
  turnaroundTime: z.string().optional(),
  verified: z.boolean().optional(),
});

const portfolioItemSchema = z.object({
  imageUrl: z.string().url(),
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
});

const respondToReviewSchema = z.object({
  response: z.string().min(3),
});

function filterTailors(
  items: TailorProfile[],
  query: {
    specialties?: string;
    minRating?: string;
    search?: string;
    sortBy?: string;
    priceRange?: string;
  }
) {
  let results = items;

  if (query.specialties) {
    const requested = query.specialties
      .split(',')
      .map((specialty) => specialty.trim().toLowerCase())
      .filter(Boolean);

    if (requested.length) {
      results = results.filter((tailor) => {
        const available = tailor.specialties.map((specialty) =>
          specialty.toLowerCase()
        );
        return requested.every((specialty) => available.includes(specialty));
      });
    }
  }

  if (query.minRating) {
    const minRating = Number(query.minRating);
    if (!Number.isNaN(minRating)) {
      results = results.filter((tailor) => tailor.rating >= minRating);
    }
  }

  if (query.search) {
    const normalizedSearch = query.search.toLowerCase();
    results = results.filter((tailor) => {
      return (
        tailor.businessName.toLowerCase().includes(normalizedSearch) ||
        tailor.description.toLowerCase().includes(normalizedSearch) ||
        tailor.specialties.some((specialty) =>
          specialty.toLowerCase().includes(normalizedSearch)
        )
      );
    });
  }

  if (query.priceRange) {
    const [min, max] = query.priceRange.split('-').map(p => parseInt(p, 10));
    if (!isNaN(min) && !isNaN(max)) {
      results = results.filter(tailor => tailor.priceRange.min >= min && tailor.priceRange.max <= max);
    }
  }

  if (query.sortBy) {
    switch (query.sortBy) {
      case 'Popular':
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'Highest Rated':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'Price: Low to High':
        results.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case 'Price: High to Low':
        results.sort((a, b) => b.priceRange.max - a.priceRange.max);
        break;
    }
  }

  return results;
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
}

function calculateReviewSummary(reviews: TailorReview[]) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? Number(
        (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      )
    : 0;
  const pendingResponses = reviews.filter((review) => !review.response).length;

  return {
    totalReviews,
    averageRating,
    pendingResponses,
  };
}

function syncTailorAggregate(tailorId: string) {
  const tailor = tailors.get(tailorId);
  if (!tailor) {
    return;
  }

  const reviews = tailorReviews.get(tailorId) ?? [];
  const summary = calculateReviewSummary(reviews);

  tailor.reviewCount = summary.totalReviews;
  tailor.rating = summary.averageRating;

  tailors.set(tailorId, tailor);
}

export default async function tailorsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: FastifyRequest) => {
    const { page = '1', pageSize = '20', specialties, minRating, search, sortBy, priceRange } =
      request.query as {
        page?: string;
        pageSize?: string;
        specialties?: string;
        minRating?: string;
        search?: string;
        sortBy?: string;
        priceRange?: string;
      };

    const pageNumber = Math.max(parseInt(page ?? '1', 10) || 1, 1);
    const pageSizeNumber = Math.max(parseInt(pageSize ?? '20', 10) || 20, 1);

    const items = Array.from(tailors.values());
    const filtered = filterTailors(items, {
      specialties,
      minRating,
      search,
      sortBy,
      priceRange,
    });

    filtered.forEach((item) => syncTailorAggregate(item.id));
    const synced = filtered
      .map((item) => tailors.get(item.id))
      .filter((item): item is TailorProfile => Boolean(item));

    const paginated = paginate(synced, pageNumber, pageSizeNumber);

    return {
      data: paginated,
      total: filtered.length,
      page: pageNumber,
      pageSize: pageSizeNumber,
      hasMore: pageNumber * pageSizeNumber < filtered.length,
    };
  });

  fastify.get(
    '/nearby',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { latitude, longitude } = request.query as {
        latitude?: string;
        longitude?: string;
      };

      if (!latitude || !longitude) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'latitude and longitude are required',
        });
      }

      // In-memory dataset lacks coordinates, so return the top-rated tailors for now.
      const nearbyTailors = Array.from(tailors.values()).sort(
        (a, b) => b.rating - a.rating
      );

      return nearbyTailors.slice(0, 20);
    }
  );

  fastify.get(
    '/:tailorId',
    async (request: FastifyRequest, reply) => {
      const { tailorId } = request.params as { tailorId: string };

      const tailor = tailors.get(tailorId);

      if (!tailor) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Tailor not found',
        });
      }

      syncTailorAggregate(tailorId);
      return tailors.get(tailorId);
    }
  );

  fastify.patch(
    '/:tailorId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { tailorId } = request.params as { tailorId: string };
      const body = updateTailorSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const tailor = tailors.get(tailorId);

      if (!tailor) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Tailor not found',
        });
      }

      if (tailor.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You are not allowed to update this tailor profile',
        });
      }

      if (body.businessName) {
        tailor.businessName = body.businessName;
      }
      if (body.description) {
        tailor.description = body.description;
      }
      if (body.avatar !== undefined) {
        tailor.avatar = body.avatar;
      }
      if (body.specialties) {
        tailor.specialties = body.specialties;
      }
      if (body.location) {
        const { coordinates, ...locationRest } = body.location;

        tailor.location = {
          ...tailor.location,
          ...locationRest,
        };

        if (coordinates) {
          const currentCoordinates = tailor.location.coordinates;
          const nextCoordinates = {
            latitude: coordinates.latitude ?? currentCoordinates?.latitude,
            longitude: coordinates.longitude ?? currentCoordinates?.longitude,
          };

          if (
            typeof nextCoordinates.latitude === 'number' &&
            typeof nextCoordinates.longitude === 'number'
          ) {
            tailor.location.coordinates = {
              latitude: nextCoordinates.latitude,
              longitude: nextCoordinates.longitude,
            };
          }
        }
      }
      if (body.priceRange) {
        tailor.priceRange = {
          ...tailor.priceRange,
          ...body.priceRange,
        };
      }
      if (body.turnaroundTime) {
        tailor.turnaroundTime = body.turnaroundTime;
      }
      if (typeof body.verified === 'boolean') {
        tailor.verified = body.verified;
      }

      tailors.set(tailorId, tailor);
      return tailor;
    }
  );

  fastify.post(
    '/:tailorId/portfolio',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { tailorId } = request.params as { tailorId: string };
      const body = portfolioItemSchema.parse(request.body);
      const { uid } = (request as AuthenticatedRequest).user;

      const tailor = tailors.get(tailorId);

      if (!tailor) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Tailor not found',
        });
      }

      if (tailor.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You are not allowed to modify this portfolio',
        });
      }

      const newItem = {
        id: `portfolio_${Date.now()}`,
        ...body,
      };

      tailor.portfolio.push(newItem);
      tailors.set(tailorId, tailor);

      return reply.code(201).send(tailor);
    }
  );

  fastify.delete(
    '/:tailorId/portfolio/:itemId',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { tailorId, itemId } = request.params as {
        tailorId: string;
        itemId: string;
      };
      const { uid } = (request as AuthenticatedRequest).user;

      const tailor = tailors.get(tailorId);

      if (!tailor) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Tailor not found',
        });
      }

      if (tailor.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You are not allowed to modify this portfolio',
        });
      }

      tailor.portfolio = tailor.portfolio.filter((item) => item.id !== itemId);
      tailors.set(tailorId, tailor);

      return reply.code(204).send();
    }
  );

  fastify.get(
  '/:tailorId/reviews',
  async (request: FastifyRequest, reply: FastifyReply) => {
      const { tailorId } = request.params as { tailorId: string };

      if (!tailors.has(tailorId)) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Tailor not found',
        });
      }

      const reviews = tailorReviews.get(tailorId) ?? [];
      const summary = calculateReviewSummary(reviews);
      syncTailorAggregate(tailorId);

      return { reviews, summary };
    }
  );

  fastify.post(
    '/:tailorId/reviews/:reviewId/respond',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply) => {
      const { tailorId, reviewId } = request.params as {
        tailorId: string;
        reviewId: string;
      };
      const { uid } = (request as AuthenticatedRequest).user;
      const body = respondToReviewSchema.parse(request.body);

      const tailor = tailors.get(tailorId);

      if (!tailor) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Tailor not found',
        });
      }

      if (tailor.userId !== uid) {
        return reply.code(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You are not allowed to respond to these reviews',
        });
      }

      const reviews = tailorReviews.get(tailorId) ?? [];
      const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

      if (reviewIndex === -1) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'Review not found',
        });
      }

      const review = reviews[reviewIndex];
      const responseRecord = {
        message: body.response,
        responderId: uid,
        createdAt: new Date().toISOString(),
      };

      const updatedReview: TailorReview = {
        ...review,
        response: responseRecord,
        updatedAt: responseRecord.createdAt,
      };

      reviews.splice(reviewIndex, 1, updatedReview);
      tailorReviews.set(tailorId, reviews);
      syncTailorAggregate(tailorId);

      return reply.send(updatedReview);
    }
  );
}
