import { Button, Col, Divider, Row } from 'antd';
import { trpc } from '../utils/trpc';
import { ProjectCard } from '../components/ProjectCard/ProjectCard';

export const ProjectsPage: React.FC = () => {
	const getProjects = trpc.project.getProjects.useQuery();

	const refetchProjects = async (): Promise<void> => {
		await getProjects.refetch();
	};

	if (getProjects.isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Button>Create Project</Button>
			<Divider />
			<Row gutter={[16, 24]}>
				{getProjects.data?.map(project => (
					<Col span={8} key={project.id}>
						<ProjectCard project={project} refetch={refetchProjects} />
					</Col>
				))}
			</Row>
		</div>
	);
};
