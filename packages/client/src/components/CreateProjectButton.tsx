import type { ButtonProps } from 'antd';
import { Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';
import { useProjects } from '../hooks/useProjects';
import { trpc } from '../utils/trpc';

type Props = ButtonProps & {
	children?: React.ReactNode;
};

export const CreateProjectButton: React.FC<Props> = props => {
	const { setActiveProject } = useActiveProject();
	const createProject = trpc.project.createProject.useMutation();
	const { refetch } = useProjects();
	const navigate = useNavigate();

	const handleCreateProject = async (): Promise<void> => {
		const project = await createProject.mutateAsync();

		setActiveProject(project.id, project.name);
		refetch();
		navigate(`/project/${project.id}`);
		notification.success({
			message: 'Project has been created',
		});
	};

	return (
		<Button onClick={handleCreateProject} {...props}>
			Create Project
		</Button>
	);
};
