import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';
import { getProjectRouter } from '../router/project.router';

type User = {
	id: string;
	name: string;
	bio?: string;
};
const users: Record<string, User> = {
	1: { id: '1', name: 'John Doe' },
};

export const t = initTRPC.context<Context>().create();
export const appRouter = t.router({
	project: getProjectRouter(t.router, t.procedure),
	getUserById: t.procedure.input(z.string()).query(
		opts => users[opts.input], // input type is string
	),
	createUser: t.procedure
		.input(
			z.object({
				name: z.string().min(3),
				bio: z.string().max(142).optional(),
			}),
		)
		.mutation(opts => {
			const id = Date.now().toString();
			const user: User = { id, ...opts.input };

			users[user.id] = user;

			return user;
		}),
});
// export type definition of API
export type AppRouter = typeof appRouter;
export type Procedure = typeof t.procedure;
export type Router = typeof t.router;
