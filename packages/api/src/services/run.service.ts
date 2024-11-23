import type { Payload } from '@chihuahua-dashboard/shared-api';
import type { PrismaClient } from '@prisma/client';

export class RunService {
	constructor(private readonly prisma: PrismaClient) {}

	async getProjectId(token?: string) {
		if (!token) {
			return 'EMPTY_TOKEN';
		}

		const project = await this.prisma.project.findFirst({
			where: { token },
			select: { id: true },
		});

		if (!project) {
			return 'PROJECT_NOT_FOUND';
		}

		return project.id;
	}

	async log(projectId: string, payload: Payload) {
		await this.prisma.run.create({
			data: {
				projectId,
				runId: payload.runId,
				action: payload.action,
				data: payload.data,
			},
		});
	}
}
