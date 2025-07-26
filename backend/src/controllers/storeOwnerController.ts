import { Request, Response } from 'express';
import prisma from '../utils/database';

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboard = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get the store owned by this user
    const store = await prisma.store.findFirst({
      where: { ownerId: userId },
      include: {
        ratings: {
          select: {
            rating: true,
            createdAt: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    const totalReviews = store.ratings.length;
    const averageRating = totalReviews > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    // Calculate trend based on last 30 days vs previous 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentRatings = store.ratings.filter(r => r.createdAt >= thirtyDaysAgo);
    const previousRatings = store.ratings.filter(r => 
      r.createdAt >= sixtyDaysAgo && r.createdAt < thirtyDaysAgo
    );

    const recentAverage = recentRatings.length > 0
      ? recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length
      : 0;

    const previousAverage = previousRatings.length > 0
      ? previousRatings.reduce((sum, r) => sum + r.rating, 0) / previousRatings.length
      : 0;

    let trend = 'stable';
    if (recentAverage > previousAverage + 0.1) {
      trend = 'up';
    } else if (recentAverage < previousAverage - 0.1) {
      trend = 'down';
    }

    return res.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      trend,
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRatings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get the store owned by this user
    const store = await prisma.store.findFirst({
      where: { ownerId: userId },
    });

    if (!store) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    const ratings = await prisma.rating.findMany({
      where: { storeId: store.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({ ratings });
  } catch (error) {
    console.error('Get store owner ratings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};