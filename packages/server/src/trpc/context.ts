import type { PrismaClient } from '@prisma/client';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export const createContext = ({ req, res }: CreateFastifyContextOptions, prisma: PrismaClient) => {
	const user = { name: req.headers.username ?? 'anonymous' };

	return { req, res, user, prisma };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
