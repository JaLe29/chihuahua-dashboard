import type { OnEndPayload } from '@chihuahua-dashboard/shared-api';
import { RunAction, RunStatus, type PrismaClient } from '@prisma/client';

export class RunService {
	constructor(private readonly prisma: PrismaClient) {}

	async getRuns(id: string) {
		const runs = await this.prisma.run.findMany({
			where: { projectId: id },
			orderBy: { createdAt: 'desc' },
		});

		return runs;
	}

	async getRunsLengthHistory(id: string) {
		const finishedRuns = await this.prisma.run.findMany({
			where: { projectId: id, status: RunStatus.finished },
			orderBy: { createdAt: 'desc' },
			include: { runLogs: { where: { action: RunAction.onEnd } } },
		});

		const runsLengthHistory = finishedRuns.map(run => {
			const payload = run.runLogs?.[0]?.data as unknown as OnEndPayload | undefined;

			return {
				createdAt: run.createdAt,
				duration: payload?.duration ?? 1,
			};
		});

		return runsLengthHistory;
	}
}
