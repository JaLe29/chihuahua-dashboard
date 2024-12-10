/* eslint-disable no-console */
import {
	getRequiredNumber,
	getRequiredString,
	loadEnv,
	registerShutdown,
	Server,
} from '@chihuahua-dashboard/shared-backend';
import { PrismaClient } from '@prisma/client';
import { CronService } from './services/cron.service';

const start = async (): Promise<void> => {
	loadEnv();
	const databaseUrl = getRequiredString('DATABASE_URL');
	const appPort = getRequiredNumber('CRON_PORT');

	const prisma = new PrismaClient({
		datasources: {
			db: {
				url: databaseUrl,
			},
		},
	});

	await prisma.$connect();

	const server = new Server({
		appName: 'cron',
		port: appPort,
	});

	const cronService = new CronService(prisma);

	setInterval(
		async () => {
			await cronService.tick();
		},
		1000 * 60 * 1,
	); // ! minutes

	await Promise.all([cronService.tick()]);

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
