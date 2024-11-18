import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { trpc, trpcClient } from './utils/trpc';
import { InAppLayout } from './InAppLayout';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectPage } from './pages/ProjectPage';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export const App: React.FC = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<InAppLayout />} path="/">
				<Route path="" Component={ProjectsPage} />
				<Route path="project/:id" Component={ProjectPage} />
				<Route path="*" Component={ProjectsPage} />
			</Route>,
		),
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</trpc.Provider>
	);
};
