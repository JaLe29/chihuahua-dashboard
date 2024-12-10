import { PageContainer, ProCard } from '@ant-design/pro-components';

import { useParams } from 'react-router-dom';
import { RunHeader } from '../components/RunHeader';
import { RunLogs } from '../components/RunLogs/RunLogs';
import { WithActiveProject } from '../components/WithActiveProject';

const RunPageInner = () => {
	const { id: runId } = useParams();

	return (
		<PageContainer subTitle="Run">
			<ProCard>
				<RunHeader runId={runId ?? 'TODO'} />
			</ProCard>
			<br />
			<RunLogs runId={runId ?? 'TODO'} />
		</PageContainer>
	);
};

export const RunPage = () => (
	<WithActiveProject>
		<RunPageInner />
	</WithActiveProject>
);
