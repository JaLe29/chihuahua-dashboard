import type { OnBeginPayload } from '@chihuahua-dashboard/shared-api';
import type { PrismaClient } from '@prisma/client';
import { RunAction } from '@prisma/client';

type GetRunsType = { id: string; createdAt: Date; data: OnBeginPayload };

export class RunService {
	constructor(private readonly prisma: PrismaClient) {}

	async getRuns(id: string): Promise<GetRunsType[]> {
		const runs = await this.prisma.run.findMany({
			where: { projectId: id, action: RunAction.onBegin },
			select: {
				createdAt: true,
				data: true,
				id: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return runs as unknown as GetRunsType[];
	}
}
