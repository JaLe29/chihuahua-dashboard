import { PAYLOAD } from '@chihuahua-dashboard/shared-api';
import {
	getRequiredNumber,
	getRequiredString,
	loadEnv,
	registerShutdown,
	Server,
} from '@chihuahua-dashboard/shared-backend';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import { pipeline } from 'stream';
import util from 'util';
import z from 'zod';
import { RunService } from './services/run.service';
import { UploadService } from './services/upload.service';

const pump = util.promisify(pipeline);

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

	await server.register(multipart);

	const runService = new RunService(prisma);
	const uploadService = new UploadService();

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

	server.post('/upload', async (req, reply) => {
		const files: any = [];
		const fields: any = {};

		// eslint-disable-next-line no-restricted-syntax
		for await (const part of req.parts()) {
			if (part.type === 'file') {
				files.push({
					fieldname: part.fieldname,
					filename: part.filename,
					mimetype: part.mimetype,
					buffer: await part.toBuffer(),
				});
			} else {
				// Podpora pro pole s více hodnotami
				// eslint-disable-next-line no-lonely-if
				if (fields[part.fieldname]) {
					if (Array.isArray(fields[part.fieldname])) {
						fields[part.fieldname].push(part.value);
					} else {
						fields[part.fieldname] = [fields[part.fieldname], part.value];
					}
				} else {
					fields[part.fieldname] = part.value;
				}
			}
		}

		return {
			success: true,
			files: files.map((f: any) => ({
				fieldname: f.fieldname,
				filename: f.filename,
				mimetype: f.mimetype,
				size: f.buffer.length,
			})),
			fields,
		};
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
	// eslint-disable-next-line no-console
	console.error(e);
});
