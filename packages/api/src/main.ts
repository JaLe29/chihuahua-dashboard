/* eslint-disable no-console */

import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import z from 'zod';
import { IN_PAYLOAD } from './const';
import { RunService } from './services/run.service';

const prisma = new PrismaClient();

const start = async (): Promise<void> => {
	await prisma.$connect();

	const fastify = Fastify({
		logger: false,
		maxParamLength: 5000,
	});

	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(cors, {});

	const runService = new RunService(prisma);

	fastify.withTypeProvider<ZodTypeProvider>().route({
		method: 'POST',
		url: '/v1/playwright/step',
		schema: {
			body: IN_PAYLOAD,
			response: {
				200: z.object({
					message: z.string(),
				}),
			},
		},
		handler: async (request, reply) => {
			const token = request.headers.authorization;
			const projectId = await runService.getProjectId(token);

			if (projectId === 'EMPTY_TOKEN') {
				await reply.status(401).send({ message: 'Unauthorized' });

				return;
			}

			if (projectId === 'PROJECT_NOT_FOUND') {
				await reply.status(401).send({ message: 'Project not found' });

				return;
			}

			const { body } = request;

			await runService.log(projectId, body);

			await reply.send({ message: 'ok' });
		},
	});

	await fastify.listen({ port: 4000 });
	console.log('Server running on port 4000');
};

start().catch(e => {
	console.error(e);
});
