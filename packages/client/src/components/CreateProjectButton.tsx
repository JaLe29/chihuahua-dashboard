import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';
import { useProjects } from '../hooks/useProjects';
import { trpc } from '../utils/trpc';

export const CreateProjectButton = () => {
	const { setActiveProject } = useActiveProject();
	const createProject = trpc.project.createProject.useMutation();
	const { refetch } = useProjects();
	const navigate = useNavigate();

	const handleCreateProject = async (): Promise<void> => {
		const project = await createProject.mutateAsync();

		setActiveProject(project.id, project.name);
		refetch();
		navigate(`/project/${project.id}`);
	};

	return <Button onClick={handleCreateProject}>Create Project</Button>;
};
