/* eslint-disable no-console */

import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import z from 'zod';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const start = async (): Promise<void> => {
	await prisma.$connect();

	const fastify = Fastify({
		logger: false,
		maxParamLength: 5000,
	});

	// Add schema validator and serializer
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(cors, {
		// put your options here
	});

	// Declare a route
	fastify.get('/', (request, reply) => reply.send({ hello: 'api' }));

	/*
	fastify.post('/v1/playwright/step', async (request, reply) => {
		console.log(request.body);

		await reply.send({ message: 'ok' });
	});
	*/

	fastify.withTypeProvider<ZodTypeProvider>().route({
		method: 'POST',
		url: '/v1/playwright/step',
		// Define your schema
		schema: {
			body: z.object({
				action: z.enum(['onBegin']),
				payload: z.any(),
			}),
			response: {
				200: z.object({
					message: z.string(),
				}),
			},
		},
		handler: async (request, reply) => {
			const { body } = request;

			console.log(body.action);
			console.log(body.payload);

			await reply.send({ message: 'ok' });
		},
	});

	await fastify.listen({ port: 4000 });
	console.log('Server running on port 4000');
};

start().catch(e => {
	console.error(e);
});
