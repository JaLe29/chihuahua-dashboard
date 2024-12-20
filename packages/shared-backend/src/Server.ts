import cors from '@fastify/cors';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

interface ServerOptions {
	port: number;
	appName: string;
	cors?: boolean;
	validators?: boolean;
}

export class Server {
	private server: FastifyInstance;

	constructor(private readonly options: ServerOptions) {
		this.server = Fastify({
			logger: false,
		});
	}

	private initSystemRoutes() {
		this.server.get('/ready', () => ({ status: 'ok' }));
	}

	async listen() {
		if (this.options.cors) {
			await this.server.register(cors, {});
		}

		if (this.options.validators) {
			this.server.setValidatorCompiler(validatorCompiler);
			this.server.setSerializerCompiler(serializerCompiler);
		}

		this.initSystemRoutes();

		await this.server.listen({ port: this.options.port, host: '0.0.0.0' });

		// eslint-disable-next-line no-console
		console.log(`${this.options.appName} running on port http://localhost:${this.options.port}`);
	}

	async close() {
		await this.server.close();
	}

	withTypeProvider() {
		if (!this.options.validators) {
			throw new Error('Type provider is not enabled');
		}

		return this.server.withTypeProvider<ZodTypeProvider>();
	}

	post(path: string, handler: (request: FastifyRequest, reply: FastifyReply) => Promise<void>) {
		this.server.post(path, handler);
	}

	async register(plugin: any, options?: any) {
		await this.server.register(plugin, options);
	}
}
