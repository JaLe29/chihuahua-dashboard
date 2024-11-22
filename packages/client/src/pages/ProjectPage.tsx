import { PageContainer, ProCard } from '@ant-design/pro-components';
import { WithActiveProject } from '../components/WithActiveProject';

const ProjectPageInner = () => {
	// eslint-disable-next-line no-console
	console.log('ProjectPage');

	return (
		<PageContainer subTitle="Project">
			<ProCard>xxxxx</ProCard>
		</PageContainer>
	);
};

export const ProjectPage = () => (
	<WithActiveProject>
		<ProjectPageInner />
	</WithActiveProject>
);
