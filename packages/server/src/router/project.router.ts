import type { Procedure, Router } from '../trpc/router';

export const getProjectRouter = (router: Router, procedure: Procedure) =>
	router({
		getProjects: procedure.query(({ ctx }) => ctx.prisma.project.findMany()),
		// mutation
		createProject: procedure.mutation(({ ctx }) =>
			ctx.prisma.project.create({ data: { name: `New Project ${new Date().toISOString()}` } }),
		),
	});
