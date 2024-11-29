import type { Payload } from '@chihuahua-dashboard/shared-api';
import { RunAction, RunStatus, type PrismaClient } from '@prisma/client';

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
		if (payload.action === RunAction.onBegin) {
			await this.prisma.run.create({
				data: {
					projectId,
					runId: payload.runId,
					status: RunStatus.running,
				},
			});
		} else {
			const run = await this.prisma.run.findFirstOrThrow({
				where: { runId: payload.runId },
			});

			await this.prisma.runLog.create({
				data: {
					runId: run.id,
					action: payload.action,
					data: payload.data,
				},
			});
		}
	}
}
