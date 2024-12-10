import type { PrismaClient } from '@prisma/client';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import type { ProjectService } from '../services/project.service';
import type { RunLogsService } from '../services/run-logs.service';
import type { RunService } from '../services/run.service';

export const createContext = (
	{ req, res }: CreateFastifyContextOptions,
	prisma: PrismaClient,
	services: { projectService: ProjectService; runService: RunService; runLogsService: RunLogsService },
) => {
	const user = { name: req.headers.username ?? 'anonymous' };

	return { req, res, user, prisma, services };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
