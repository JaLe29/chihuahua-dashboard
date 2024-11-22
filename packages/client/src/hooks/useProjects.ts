import { useEffect } from 'react';
import type { RouterOutput } from '../utils/trpc';
import { trpc } from '../utils/trpc';
import { useActiveProject } from './useActiveProject';
import { useUrlHash } from './useUrlHash';

type Projects = RouterOutput['project']['getProjectNames'][number];

interface Response {
	projects?: Projects[];
	refetch: () => void;
}

export const useProjects = (): Response => {
	const { activeProjectId, setActiveProject, setInitialized } = useActiveProject();
	const { hash } = useUrlHash();
	const getProjectNames = trpc.project.getProjectNames.useQuery();

	useEffect(() => {
		if (!activeProjectId && getProjectNames.data) {
			const project = getProjectNames.data.find(p => p.id === hash);

			if (project) {
				setActiveProject(project.id, project.name, true);
			} else {
				setInitialized(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getProjectNames.data, activeProjectId]);

	return { projects: getProjectNames.data, refetch: getProjectNames.refetch };
};
