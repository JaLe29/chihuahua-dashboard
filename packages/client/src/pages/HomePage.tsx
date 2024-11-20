import { Button } from 'antd';
import { trpc } from '../utils/trpc';

export const HomePage: React.FC = () => {
	const getProjects = trpc.project.getProjects.useQuery();

	const createProject = trpc.project.createProject.useMutation();

	const handleCreateProject = async (): Promise<void> => {
		await createProject.mutate();
		await getProjects.refetch();
	};

	return (
		<div>
			{getProjects.data?.map(project => project.name)}
			<Button onClick={handleCreateProject}>Create Project</Button>
		</div>
	);
};
