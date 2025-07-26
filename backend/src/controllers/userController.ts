import { Request, Response } from 'express';
import prisma from '../utils/database';
import { CreateRatingRequest, UpdateRatingRequest } from '../types';

interface AuthRequest extends Request {
  user?: any;
}

export const getStores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { search } = req.query;
    const userId = (req as AuthRequest).user?.id;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: {
          select: {
            rating: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const storesWithRating = stores.map(store => {
      const totalRatings = store.ratings.length;
      const averageRating = totalRatings > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

      const userRating = store.ratings.find(r => r.userId === userId)?.rating;

      const { ratings, ...storeWithoutRatings } = store;

      return {
        ...storeWithoutRatings,
        averageRating,
        totalRatings,
        userRating,
      };
    });

    return res.json({
      stores: storesWithRating,
    });
  } catch (error) {
    console.error('Get stores error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createRating = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { storeId, rating }: CreateRatingRequest = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      return res.status(409).json({ error: 'You have already rated this store' });
    }

    const newRating = await prisma.rating.create({
      data: {
        userId,
        storeId,
        rating,
      },
    });

    return res.status(201).json({ rating: newRating });
  } catch (error) {
    console.error('Create rating error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRating = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { rating }: UpdateRatingRequest = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if rating exists and belongs to user
    const existingRating = await prisma.rating.findUnique({
      where: { id },
    });

    if (!existingRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (existingRating.userId !== userId) {
      return res.status(403).json({ error: 'You can only update your own ratings' });
    }

    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { rating },
    });

    return res.json({ rating: updatedRating });
  } catch (error) {
    console.error('Update rating error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};