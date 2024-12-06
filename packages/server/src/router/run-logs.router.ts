import { ID } from '@chihuahua-dashboard/shared-server';
import { z } from 'zod';
import type { Procedure, Router } from '../trpc/router';

export const getRunLogsRouter = (router: Router, procedure: Procedure) =>
	router({
		// query
		getRunLogs: procedure
			.input(z.object({ runId: ID }))
			.query(({ ctx, input }) => ctx.services.runLogsService.getRunLogs(input.runId)),

		getRunLogsAll: procedure
			.input(z.object({ runId: ID, runLogId: z.string() }))
			.query(({ ctx, input }) => ctx.services.runLogsService.getRunLogsAll(input.runId, input.runLogId)),
	});
