import type { PrismaClient } from '@prisma/client';
import type { InPayload } from '../const';

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

	async log(projectId: string, payload: InPayload) {
		console.log(payload);
	}
}
