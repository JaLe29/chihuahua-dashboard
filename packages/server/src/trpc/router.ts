import { initTRPC } from '@trpc/server';
import { getProjectConfigRouter } from '../router/project-config.router';
import { getProjectRouter } from '../router/project.router';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create();
export const appRouter = t.router({
	project: getProjectRouter(t.router, t.procedure),
	projectConfig: getProjectConfigRouter(t.router, t.procedure),
});
// export type definition of API
export type AppRouter = typeof appRouter;
export type Procedure = typeof t.procedure;
export type Router = typeof t.router;
