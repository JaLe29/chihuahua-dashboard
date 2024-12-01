/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import type { ProjectConfig } from '@chihuahua-dashboard/shared-server';
import { RunStatus, type PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

export class CronService {
	constructor(private readonly prisma: PrismaClient) {}

	private async tickEndedRuns(projectId: string, maxTimeout: number) {
		const targetTime = dayjs().subtract(maxTimeout, 'minutes').toDate();

		const runsWithoutEnd = await this.prisma.run.findMany({
			where: {
				projectId,
				status: RunStatus.running,
				createdAt: {
					lt: targetTime,
				},
			},
		});

		for (const run of runsWithoutEnd) {
			await this.prisma.run.update({
				where: { id: run.id },
				data: { status: RunStatus.timeout },
			});
			// eslint-disable-next-line no-console
			console.log(`Run ${run.id} timed out`);
		}
	}

	private async tickRetention(projectId: string, retention: number) {
		const targetTime = dayjs().subtract(retention, 'days').toDate();

		const runsToDelete = await this.prisma.run.findMany({
			where: { projectId, createdAt: { lt: targetTime } },
		});

		for (const run of runsToDelete) {
			// todo delete files
			await this.prisma.run.delete({ where: { id: run.id } });

			// eslint-disable-next-line no-console
			console.log(`Run ${run.id} deleted`);
		}
	}

	async tick() {
		const projects = await this.prisma.project.findMany({
			select: {
				id: true,
				config: {
					select: {
						data: true,
					},
				},
			},
		});

		for (const project of projects) {
			const config = project.config?.data as ProjectConfig | undefined;
			if (!config) {
				continue;
			}

			const { maxTimeout, retention } = config;

			await this.tickEndedRuns(project.id, maxTimeout);

			await this.tickRetention(project.id, retention);
		}
	}
}
