/* eslint-disable no-console */

import { PAYLOAD } from '@chihuahua-dashboard/shared-api';
import {
	getRequiredNumber,
	getRequiredString,
	loadEnv,
	registerShutdown,
	Server,
} from '@chihuahua-dashboard/shared-backend';
import { PrismaClient } from '@prisma/client';
import z from 'zod';
import { RunService } from './services/run.service';

const start = async (): Promise<void> => {
	loadEnv();

	const databaseUrl = getRequiredString('DATABASE_URL');
	const appPort = getRequiredNumber('API_PORT');

	const prisma = new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	});

	await prisma.$connect();

	const server = new Server({
		appName: 'api',
		port: appPort,
		validators: true,
	});

	const runService = new RunService(prisma);

	server.withTypeProvider().route({
		method: 'POST',
		url: '/v1/playwright/step',
		schema: {
			body: PAYLOAD,
			response: {
				200: z.object({
					message: z.string(),
				}),
			},
		},
		handler: async (request, reply) => {
			const token = request.headers.authorization;
			const projectId = await runService.getProjectId(token);

			console.log({ token });

			if (projectId === 'EMPTY_TOKEN') {
				await reply.status(401).send({ message: 'Unauthorized' });

				return;
			}

			if (projectId === 'PROJECT_NOT_FOUND') {
				await reply.status(401).send({ message: 'Project not found' });

				return;
			}

			const { body } = request;

			const result = await runService.log(projectId, body);

			if (result === 'RUN_NOT_RUNNING') {
				await reply.status(400).send({ message: 'Run not running' });

				return;
			}

			await reply.send({ message: 'ok' });
		},
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
