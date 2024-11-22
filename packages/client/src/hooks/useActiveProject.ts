import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import { useUrlHash } from './useUrlHash';

interface Props {
	activeProjectId?: string;
	activeProjectName?: string;
	setActiveProject: (projectId: string, activeProjectName: string, initialized?: boolean) => void;
	// Whether the active project has been initialized
	initialized: boolean;
	setInitialized: (initialized: boolean) => void;
}

export const useDeviceStore: UseBoundStore<StoreApi<Props>> = create(set => ({
	activeProject: undefined,
	activeProjectName: undefined,
	setActiveProject: (projectId: string, activeProjectName: string, initialized?: boolean) => {
		if (typeof initialized === 'boolean') {
			set({ activeProjectId: projectId, activeProjectName, initialized });
		}

		set({ activeProjectId: projectId, activeProjectName });
	},
	initialized: false,
	setInitialized: (initialized: boolean) => set({ initialized }),
}));

export const useActiveProject = (): Props => {
	const { setHash } = useUrlHash();
	const { activeProjectId, activeProjectName, setActiveProject, initialized, setInitialized } = useDeviceStore();

	const setActiveProjectFn = (projectIdIn: string, activeProjectNameIn: string, initializedIn?: boolean) => {
		setHash(projectIdIn);
		setActiveProject(projectIdIn, activeProjectNameIn, initializedIn);
	};

	return {
		activeProjectId,
		activeProjectName,
		setActiveProject: setActiveProjectFn,
		initialized,
		setInitialized,
	};
};
