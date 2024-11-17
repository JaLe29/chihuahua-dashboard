/* eslint-disable no-console */
import type { CreateFastifyContextOptions, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { hello } from '@chihuahua-dashboard/shared';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { createContext } from './trpc/context';
import { appRouter, type AppRouter } from './trpc/router';

const prisma = new PrismaClient();

const start = async (): Promise<void> => {
	await prisma.$connect();

	const projects = await prisma.project.findMany();

	console.log(projects);
	console.log(hello());
	const fastify = Fastify({
		logger: true,
		maxParamLength: 5000,
	});

	await fastify.register(cors, {
		// put your options here
	});

	// Declare a route
	fastify.get('/', (request, reply) => reply.send({ hello: 'world' }));

	await fastify.register(fastifyTRPCPlugin, {
		prefix: '/trpc',
		trpcOptions: {
			router: appRouter,
			createContext: ({ req, res }: CreateFastifyContextOptions) => createContext({ req, res }, prisma),
			onError({ path, error }) {
				// report to error monitoring
				console.error(`Error in tRPC handler on path '${path}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
	});

	await fastify.listen({ port: 3000 });
};

start().catch(e => {
	console.error(e);
});
