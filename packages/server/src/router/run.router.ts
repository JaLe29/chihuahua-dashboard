import { ID } from '@chihuahua-dashboard/shared-server';
import { z } from 'zod';
import type { Procedure, Router } from '../trpc/router';

export const getRunRouter = (router: Router, procedure: Procedure) =>
	router({
		// query
		getRuns: procedure
			.input(z.object({ projectId: ID }))
			.query(({ ctx, input }) => ctx.services.runService.getRuns(input.projectId)),
		getRunsLengthHistory: procedure
			.input(z.object({ projectId: ID }))
			.query(({ ctx, input }) => ctx.services.runService.getRunsLengthHistory(input.projectId)),
		getRunHeader: procedure
			.input(z.object({ projectId: ID, runId: ID }))
			.query(({ ctx, input }) => ctx.services.runService.getRunHeader(input.projectId, input.runId)),
	});
