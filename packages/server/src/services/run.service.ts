import type { OnEndPayload } from '@chihuahua-dashboard/shared-api';
import { RunAction, RunStatus, type PrismaClient } from '@prisma/client';

export class RunService {
	constructor(private readonly prisma: PrismaClient) {}

	async getRuns(projectId: string) {
		const runs = await this.prisma.run.findMany({
			where: { projectId },
			orderBy: { createdAt: 'desc' },
			include: { runLogs: { where: { action: RunAction.onEnd } } },
		});

		return runs.map(r => {
			const { runLogs, ...rest } = r;

			return {
				run: rest,
				logs: {
					onEnd: runLogs.find(log => log.action === RunAction.onEnd)?.data as unknown as
						| OnEndPayload
						| undefined,
				},
			};
		});
	}

	async getRunsLengthHistory(projectId: string) {
		const finishedRuns = await this.prisma.run.findMany({
			where: { projectId, status: RunStatus.finished },
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

	async getRun(projectId: string, runId: string) {
		const run = await this.prisma.run.findUnique({ where: { id: runId, projectId }, include: { runLogs: true } });
		if (!run) {
			return null;
		}

		const { runLogs, ...rest } = run;

		return {
			run: rest,
			logs: {
				onEnd: runLogs?.find(log => log.action === RunAction.onEnd)?.data as unknown as
					| OnEndPayload
					| undefined,
			},
		};
	}
}
