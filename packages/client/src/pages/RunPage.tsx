import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams } from 'react-router-dom';
import { WithActiveProject } from '../components/WithActiveProject';
import { useActiveProject } from '../hooks/useActiveProject';
import { trpc } from '../utils/trpc';

const RunPageInner = () => {
	const { project } = useActiveProject();
	const { id: runId } = useParams();

	const getRun = trpc.run.getRun.useQuery({ projectId: project?.id ?? 'TODO', runId: runId ?? 'TODO' });

	console.log(getRun.data);

	return (
		<PageContainer subTitle="Run">
			<ProCard>
				<div>{runId}</div>
			</ProCard>
		</PageContainer>
	);
};

export const RunPage = () => (
	<WithActiveProject>
		<RunPageInner />
	</WithActiveProject>
);
