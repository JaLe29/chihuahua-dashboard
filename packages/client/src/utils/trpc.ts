import { createTRPCProxyClient, httpLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
// eslint-disable-next-line import/no-relative-packages
import type { AppRouter } from '@chihuahua-dashboard/server/src/trpc/router';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>();

const BASE_API = 'http://localhost:3002';

export const trpcClient = trpc.createClient({
	// transformer: superjson as any,

	links: [
		// httpBatchLink({
		httpLink({
			headers() {
				const t = 'todo';
				if (!t) {
					return {};
				}

				return {
					authorization: t,
				};
			},
			url: `${BASE_API}/trpc`,
			// maxURLLength: MAX_URL_LEN,
		}),
	],
});

export const trcpProxyClient = createTRPCProxyClient<AppRouter>({
	// transformer: superjson as any,
	links: [
		// httpBatchLink({
		httpLink({
			headers() {
				const t = 'todo';
				if (!t) {
					return {};
				}

				return {
					authorization: t,
				};
			},
			url: `${BASE_API}/trpc`,
			// maxURLLength: MAX_URL_LEN,
		}),
	],
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
