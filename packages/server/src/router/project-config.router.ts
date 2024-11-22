import type { ProjectConfig } from '@chihuahua-dashboard/shared';
import { ID, PROJECT_CONFIG_SCHEMA } from '@chihuahua-dashboard/shared';
import type { InputJsonValue } from '@prisma/client/runtime/library';
import { z } from 'zod';
import type { Procedure, Router } from '../trpc/router';

export const getProjectConfigRouter = (router: Router, procedure: Procedure) =>
	router({
		// query
		getConfig: procedure.input(z.object({ id: ID })).query(async ({ ctx, input }) => {
			const project = await ctx.prisma.projectConfig.findUniqueOrThrow({ where: { projectId: input.id } });

			return project.data as unknown as ProjectConfig;
		}),
		// mutation
		updateConfig: procedure
			.input(z.object({ id: ID, data: PROJECT_CONFIG_SCHEMA }))
			.mutation(async ({ ctx, input }) => {
				await ctx.prisma.projectConfig.update({
					where: { projectId: input.id },
					data: { data: input.data as unknown as InputJsonValue },
				});
			}),
	});
