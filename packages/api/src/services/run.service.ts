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

			return true;
		}

		const run = await this.prisma.run.findFirstOrThrow({
			where: { runId: payload.runId },
		});

		if (run.status !== RunStatus.running) {
			return 'RUN_NOT_RUNNING';
		}

		if (payload.action === RunAction.onEnd) {
			await this.prisma.run.update({
				where: { id: run.id },
				data: { status: RunStatus.finished },
			});
		}

		await this.prisma.runLog.create({
			data: {
				runId: run.id,
				action: payload.action,
				data: payload.data,
			},
		});

		return true;
	}
}
