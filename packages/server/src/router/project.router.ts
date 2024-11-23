import { ID } from '@chihuahua-dashboard/shared';
import { z } from 'zod';
import type { Procedure, Router } from '../trpc/router';

export const getProjectRouter = (router: Router, procedure: Procedure) =>
	router({
		// query
		getProjectNames: procedure.query(({ ctx }) =>
			ctx.prisma.project.findMany({ select: { name: true, description: true, id: true } }),
		),
		getProjects: procedure.query(({ ctx }) => ctx.prisma.project.findMany()),
		getProject: procedure
			.input(z.object({ id: ID }))
			.query(({ ctx, input }) => ctx.services.projectService.getProject(input.id)),
		getProjectSettings: procedure.input(z.object({ id: ID })).query(({ ctx, input }) =>
			ctx.prisma.project.findUniqueOrThrow({
				where: { id: input.id },
				select: { name: true, description: true },
			}),
		),
		getProjectToken: procedure.input(z.object({ id: ID })).query(({ ctx, input }) =>
			ctx.prisma.project.findUniqueOrThrow({
				where: { id: input.id },
				select: { token: true },
			}),
		),
		// mutation
		createProject: procedure.mutation(({ ctx }) => ctx.services.projectService.createProject()),
		deleteProject: procedure
			.input(z.object({ id: ID }))
			.mutation(({ ctx, input }) => ctx.prisma.project.delete({ where: { id: input.id } })),
		updateProjectSettings: procedure
			.input(z.object({ id: ID, data: z.object({ name: z.string(), description: z.string().optional() }) })) // todo schema
			.mutation(({ ctx, input }) => ctx.prisma.project.update({ where: { id: input.id }, data: input.data })),
		regenerateProjectToken: procedure
			.input(z.object({ id: ID }))
			.mutation(({ ctx, input }) => ctx.services.projectService.regenerateProjectToken(input.id)),
	});
