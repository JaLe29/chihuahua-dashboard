import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { InAppLayout } from './InAppLayout';
import { ProjectConfigPage } from './pages/ProjectConfigPage';
import { ProjectPage } from './pages/ProjectPage';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { RunPage } from './pages/RunPage';
import { trpc, trpcClient } from './utils/trpc';

dayjs.extend(durationPlugin);

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
				<Route path="project" Component={ProjectPage} />
				<Route path="run/:id" Component={RunPage} />
				<Route path="config" Component={ProjectConfigPage} />
				<Route path="settings" Component={ProjectSettingsPage} />
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
