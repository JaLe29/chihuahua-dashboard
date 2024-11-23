import { DATE_FORMATS, type ProjectConfig } from '@chihuahua-dashboard/shared';
import type { PrismaClient } from '@prisma/client';
import type { InputJsonValue } from '@prisma/client/runtime/library';

export class ProjectService {
	constructor(private readonly prisma: PrismaClient) {}

	private generateToken(): string {
		return new Array(5)
			.fill(0)
			.map(() => crypto.randomUUID())
			.join('-');
	}

	async getProject(projectId: string) {
		const project = await this.prisma.project.findUniqueOrThrow({
			where: { id: projectId },
			select: {
				id: true,
				name: true,
				description: true,
				config: {
					select: {
						data: true,
					},
				},
			},
		});

		const config = project.config!.data as unknown as ProjectConfig;

		return {
			...project,
			config: {
				dateFormat: config.dateFormat,
			},
		};
	}

	async createProject(): Promise<{ id: string }> {
		const config: ProjectConfig = {
			maxTimeout: 1000 * 60 * 60,
			retention: 1,
			dateFormat: DATE_FORMATS[0].value,
		};

		const token = this.generateToken();

		const project = await this.prisma.project.create({
			data: {
				name: `New Project ${new Date().toISOString()}`,
				config: { create: { data: config as unknown as InputJsonValue } },
				token,
			},
			select: { id: true },
		});

		return { id: project.id };
	}

	async regenerateProjectToken(id: string): Promise<string> {
		const token = this.generateToken();

		await this.prisma.project.update({ where: { id }, data: { token } });

		return token;
	}
}
