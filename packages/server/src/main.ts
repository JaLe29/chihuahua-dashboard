/* eslint-disable no-console */
import {
	getRequiredNumber,
	getRequiredString,
	loadEnv,
	registerShutdown,
	Server,
} from '@chihuahua-dashboard/shared-backend';
import { PrismaClient } from '@prisma/client';
import type { CreateFastifyContextOptions, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { ProjectService } from './services/project.service';
import { RunService } from './services/run.service';
import { createContext } from './trpc/context';
import { appRouter, type AppRouter } from './trpc/router';

const start = async (): Promise<void> => {
	loadEnv();

	const databaseUrl = getRequiredString('DATABASE_URL');
	const appPort = getRequiredNumber('SERVER_PORT');

	const prisma = new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	});

	await prisma.$connect();

	const server = new Server({
		cors: true,
		appName: 'server',
		port: appPort,
	});

	const services = {
		projectService: new ProjectService(prisma),
		runService: new RunService(prisma),
	};

	await server.register(fastifyTRPCPlugin, {
		prefix: '/trpc',
		trpcOptions: {
			router: appRouter,
			createContext: ({ req, res }: CreateFastifyContextOptions) => createContext({ req, res }, prisma, services),
			onError({ path, error }) {
				// report to error monitoring
				console.error(`Error in tRPC handler on path '${path}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
	});

	registerShutdown([
		async () => {
			await server.close();
		},
		async () => {
			await prisma.$disconnect();
		},
	]);

	await server.listen();
};

start().catch(e => {
	console.error(e);
});
