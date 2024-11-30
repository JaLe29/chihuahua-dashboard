import { ID } from '@chihuahua-dashboard/shared-server';
import { z } from 'zod';
import type { Procedure, Router } from '../trpc/router';

export const getRunRouter = (router: Router, procedure: Procedure) =>
	router({
		// query
		getRuns: procedure
			.input(z.object({ id: ID }))
			.query(({ ctx, input }) => ctx.services.runService.getRuns(input.id)),
		getRunsLengthHistory: procedure
			.input(z.object({ id: ID }))
			.query(({ ctx, input }) => ctx.services.runService.getRunsLengthHistory(input.id)),
	});
