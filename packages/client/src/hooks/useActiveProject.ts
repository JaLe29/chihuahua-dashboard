import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import { trcpProxyClient, type RouterOutput } from '../utils/trpc';
import { useUrlHash } from './useUrlHash';

type Project = RouterOutput['project']['getProject'];

interface Props {
	clearActiveProject: () => void;
	// Whether the active project has been initialized
	initialized: boolean;
	setInitialized: (initialized: boolean) => void;
	//
	project: Project | undefined;
	setProject: (project: Project) => void;
}

export const useDeviceStore: UseBoundStore<StoreApi<Props>> = create(set => ({
	clearActiveProject: () => set({ project: undefined }),
	//
	initialized: false,
	setInitialized: (initialized: boolean) => set({ initialized }),
	//
	project: undefined,
	setProject: (project: Project) => set({ project }),
}));

export const useActiveProject = (): Omit<Props, 'setProject'> & {
	setProject: (projectId: string, initializedIn?: boolean) => Promise<void>;
} => {
	const { setHash } = useUrlHash();
	const { project, setProject, clearActiveProject, initialized, setInitialized } = useDeviceStore();

	const setProjectInner = async (projectId: string, initializedIn?: boolean) => {
		setHash(projectId);

		const projectResponse = await trcpProxyClient.project.getProject.query({ id: projectId });

		setProject(projectResponse);

		if (typeof initializedIn === 'boolean') {
			setInitialized(initializedIn);
		}
	};

	return {
		project,
		setProject: setProjectInner,
		initialized,
		setInitialized,
		clearActiveProject,
	};
};
