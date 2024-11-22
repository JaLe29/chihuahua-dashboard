import type { ProjectConfig } from '@chihuahua-dashboard/shared';
import type { PrismaClient } from '@prisma/client';
import type { InputJsonValue } from '@prisma/client/runtime/library';

export class ProjectService {
	constructor(private readonly prisma: PrismaClient) {}

	async createProject(): Promise<{ id: string; name: string }> {
		const config: ProjectConfig = {
			maxTimeout: 1000 * 60 * 60,
			retention: 1,
		};

		const project = await this.prisma.project.create({
			data: {
				name: `New Project ${new Date().toISOString()}`,
				config: { create: { data: config as unknown as InputJsonValue } },
			},
			select: { id: true, name: true },
		});

		return { id: project.id, name: project.name };
	}
}
