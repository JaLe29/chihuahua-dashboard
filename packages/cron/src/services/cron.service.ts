/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import type { ProjectConfig } from '@chihuahua-dashboard/shared';
import { RunStatus, type PrismaClient } from '@prisma/client';

export class CronService {
	constructor(private readonly prisma: PrismaClient) {}

	async tickDeadRuns() {
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

			const { maxTimeout } = config;

			const runsWithoutEnd = await this.prisma.run.findMany({
				where: {
					projectId: project.id,
					status: RunStatus.running,
					createdAt: {
						lt: new Date(Date.now() - maxTimeout * 60 * 1000),
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
	}
}
