import type { OnBeginPayload, OnTestBeginPayload, OnTestEndPayload, Payload } from '@chihuahua-dashboard/shared-api';
import { RunAction, type PrismaClient } from '@prisma/client';

export class RunLogsService {
	constructor(private readonly prisma: PrismaClient) {}

	// todo rename
	async getRunLogs(runId: string) {
		const data = await this.prisma.runLog.findMany({
			where: { runId, action: { in: [RunAction.onTestBegin, RunAction.onTestEnd, RunAction.onBegin] } },
		});
		const onBeginLogData = data.filter(log => log.action === RunAction.onBegin)[0]?.data as
			| OnBeginPayload
			| undefined;

		const reduced = data.reduce(
			(acc, log) => {
				const payload = log.data as OnTestBeginPayload | OnTestEndPayload;

				const testId = payload.id;
				const target = acc.find(item => item.id === testId);

				const logWithAction = { ...payload, action: log.action };
				if (target) {
					target.data.push(logWithAction);
				} else {
					acc.push({ id: testId, title: 'not found', data: [logWithAction] });
				}

				return acc;
			},
			[] as {
				id: string;
				title: string;
				data: ((OnTestBeginPayload | OnTestEndPayload) & { action: RunAction })[];
			}[],
		);

		const mapped = reduced.map(item => {
			const onBeginLog = onBeginLogData?.find(log => log.id === item.id);

			return {
				...item,
				title: onBeginLog?.title ?? 'not found',
			};
		});

		const sortedByTitle = mapped.sort((a, b) => a.title.localeCompare(b.title));

		return sortedByTitle;
	}

	// todo rename
	async getRunLogsAll(runId: string, runLogId: string) {
		const data = await this.prisma.runLog.findMany({
			where: { runId, testId: runLogId },
			select: { data: true, action: true, createdAt: true },
			orderBy: {
				createdAt: 'asc',
			},
		});

		return data as unknown as Payload[];
	}
}
