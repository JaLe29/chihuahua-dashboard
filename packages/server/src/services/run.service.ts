import type { OnBeginPayload, OnEndPayload } from '@chihuahua-dashboard/shared-api';
import type { PrismaClient } from '@prisma/client';
import { RunAction } from '@prisma/client';

type GetRunsType = {
	runId: string;
	createdAt: Date;
	data: {
		onBegin: OnBeginPayload;
		onEnd?: OnEndPayload;
	};
	isRunning: boolean;
};

export class RunService {
	constructor(private readonly prisma: PrismaClient) {}

	async getRuns(id: string, options?: { onlyFinished?: boolean }): Promise<GetRunsType[]> {
		const onlyFinished = options?.onlyFinished ?? false;
		const runs = await this.prisma.run.findMany({
			where: { projectId: id, OR: [{ action: RunAction.onBegin }, { action: RunAction.onEnd }] },
			select: {
				createdAt: true,
				action: true,
				data: true,
				id: true,
				runId: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		const begins = runs.filter(run => run.action === RunAction.onBegin);
		const ends = runs
			.filter(run => run.action === RunAction.onEnd)
			.reduce(
				(acc, run) => {
					acc[run.runId] = run.data as unknown as OnEndPayload;

					return acc;
				},
				{} as Record<string, OnEndPayload>,
			);

		const data = begins
			.map(begin => ({
				runId: begin.runId,
				createdAt: begin.createdAt,
				data: { onBegin: begin.data as unknown as OnBeginPayload, onEnd: ends[begin.runId] },
				isRunning: !!ends[begin.runId],
			}))
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

		if (onlyFinished) {
			return data.filter(run => run.isRunning);
		}

		return data;
	}

	async getRunsLengthHistory(id: string) {
		const runs = await this.getRuns(id, { onlyFinished: true });

		return runs.map(run => ({ createdAt: run.createdAt, duration: run.data.onEnd?.duration ?? 1 }));
	}
}
