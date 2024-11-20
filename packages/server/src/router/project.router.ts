import { z } from 'zod';
import { ID } from '@chihuahua-dashboard/shared';
import type { Procedure, Router } from '../trpc/router';

export const getProjectRouter = (router: Router, procedure: Procedure) =>
	router({
		// query
		getProjects: procedure.query(({ ctx }) => ctx.prisma.project.findMany()),
		getProject: procedure
			.input(z.object({ id: ID }))
			.query(({ ctx, input }) => ctx.prisma.project.findUnique({ where: { id: input.id } })),
		// mutation
		createProject: procedure.mutation(({ ctx }) =>
			ctx.prisma.project.create({ data: { name: `New Project ${new Date().toISOString()}` } }),
		),
		deleteProject: procedure
			.input(z.object({ id: ID }))
			.mutation(({ ctx, input }) => ctx.prisma.project.delete({ where: { id: input.id } })),
	});
