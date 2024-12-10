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
	const { setProject, project, setInitialized } = useActiveProject();
	const { hash } = useUrlHash();
	const getProjectNames = trpc.project.getProjectNames.useQuery();

	useEffect(() => {
		if (!project && getProjectNames.data) {
			const targetProject = getProjectNames.data.find(p => p.id === hash);

			if (targetProject) {
				// eslint-disable-next-line no-console
				setProject(targetProject.id, true).catch(console.error);
			} else {
				setInitialized(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getProjectNames.data, project]);

	return { projects: getProjectNames.data, refetch: getProjectNames.refetch };
};
