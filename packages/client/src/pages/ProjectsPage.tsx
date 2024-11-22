import { PageContainer } from '@ant-design/pro-components';
import { Col, Empty, Row } from 'antd';
import { CreateProjectButton } from '../components/CreateProjectButton';
import { ProjectCard } from '../components/ProjectCard/ProjectCard';
import { trpc } from '../utils/trpc';

export const ProjectsPage: React.FC = () => {
	const getProjects = trpc.project.getProjects.useQuery();

	if (getProjects.isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<PageContainer subTitle="List of Projects" extra={[<CreateProjectButton key="1" />]}>
			{/* 			<ProCard
				style={{
					height: '200vh',
					minHeight: 800,
				}}
			> */}
			<div>
				<Row gutter={[16, 24]}>
					{getProjects.data?.map(project => (
						<Col span={8} key={project.id}>
							<ProjectCard project={project} />
						</Col>
					))}
				</Row>
				{getProjects.data?.length === 0 && <Empty />}
			</div>
			{/* 		</ProCard>{ */}
		</PageContainer>
	);
};
