/* eslint-disable no-console */
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import type { CreateFastifyContextOptions, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { ProjectService } from './services/project.service';
import { createContext } from './trpc/context';
import { appRouter, type AppRouter } from './trpc/router';

const prisma = new PrismaClient();

const start = async (): Promise<void> => {
	await prisma.$connect();

	const fastify = Fastify({
		logger: true,
		maxParamLength: 5000,
	});

	await fastify.register(cors, {
		// put your options here
	});

	const services = {
		projectService: new ProjectService(prisma),
	};

	await fastify.register(fastifyTRPCPlugin, {
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

	await fastify.listen({ port: 4000 });
};

start().catch(e => {
	console.error(e);
});
