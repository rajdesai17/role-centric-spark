import { Request, Response } from 'express';
import prisma from '../utils/database';
import { hashPassword } from '../utils/bcrypt';
import { CreateUserRequest, CreateStoreRequest } from '../types';


export const getDashboard = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecentActivity = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Get recent stores (last 10)
    const recentStores = await prisma.store.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent ratings (last 10)
    const recentRatings = await prisma.rating.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        store: {
          select: {
            name: true,
          },
        },
      },
    });

    // Combine and sort all activities by creation date
    const activities = [
      ...recentUsers.map(user => ({
        type: 'user_created',
        id: user.id,
        title: 'New user registered',
        description: `${user.name} joined the platform`,
        timestamp: user.createdAt,
        data: user,
      })),
      ...recentStores.map(store => ({
        type: 'store_created',
        id: store.id,
        title: 'Store added',
        description: `${store.name} was registered by ${store.owner.name}`,
        timestamp: store.createdAt,
        data: store,
      })),
      ...recentRatings.map(rating => ({
        type: 'rating_created',
        id: rating.id,
        title: 'New rating submitted',
        description: `${rating.user.name} gave ${rating.rating} stars to ${rating.store.name}`,
        timestamp: rating.createdAt,
        data: rating,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Get top 10 most recent activities

    return res.json({ activities });
  } catch (error) {
    console.error('Get recent activity error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { search, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const users = await prisma.user.findMany({
      where,
      orderBy,
      include: {
        stores: {
          include: {
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    const usersWithRating = users.map(user => {
      let averageRating = 0;
      let totalRatings = 0;

      if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
        const allRatings = user.stores.flatMap(store => store.ratings);
        totalRatings = allRatings.length;
        if (totalRatings > 0) {
          averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        }
      }

      const { stores, ...userWithoutStores } = user;

      return {
        ...userWithoutStores,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        totalRatings,
      };
    });

    const total = await prisma.user.count({ where });

    return res.json({
      users: usersWithRating,
      total,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, address, role }: CreateUserRequest = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address: address || null,
        role,
      },
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

    return res.status(201).json({ user });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        stores: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let storeRating: number | undefined;
    if (user.stores.length > 0) {
      const store = user.stores[0];
      if (store.ratings.length > 0) {
        const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
        storeRating = totalRating / store.ratings.length;
      }
    }

    const { stores, ...userWithoutStores } = user;

    return res.json({
      user: userWithoutStores,
      storeRating,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const storesWithRating = stores.map(store => {
      const totalRatings = store.ratings.length;
      const averageRating = totalRatings > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

      const { ratings, ...storeWithoutRatings } = store;

      return {
        ...storeWithoutRatings,
        averageRating,
        totalRatings,
      };
    });

    const total = await prisma.store.count({ where });

    return res.json({
      stores: storesWithRating,
      total,
    });
  } catch (error) {
    console.error('Get stores error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createStore = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, address, ownerId }: CreateStoreRequest = req.body;

    // Check if owner exists and is a store owner
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    if (owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ error: 'User must be a store owner' });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({ store });
  } catch (error) {
    console.error('Create store error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};