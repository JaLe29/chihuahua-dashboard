/* eslint-disable no-console */

import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import { CronService } from './services/cron.service';

const prisma = new PrismaClient();

const start = async (): Promise<void> => {
	await prisma.$connect();

	const fastify = Fastify({
		logger: false,
		maxParamLength: 5000,
	});

	await fastify.register(cors, {});

	const cronService = new CronService(prisma);

	setInterval(
		() => {
			cronService.tickDeadRuns();
		},
		1000 * 60 * 1,
	); // ! minutes

	await Promise.all([cronService.tickDeadRuns()]);

	await fastify.listen({ port: 4001 });
	console.log('Server running on port 4000');
};

start().catch(e => {
	console.error(e);
});
