import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { DateWithFormat } from '../components/DateWithFormat';
import { NoStyleLink } from '../components/NoStyleLink';
import { RunsLengthHistoryChart } from '../components/RunsLengthHistoryChart';
import { WithActiveProject } from '../components/WithActiveProject';
import { useActiveProject } from '../hooks/useActiveProject';
import type { RouterOutput } from '../utils/trpc';
import { trpc } from '../utils/trpc';

type ProjectRow = RouterOutput['run']['getRuns'][number];

const COLUMNS: ProColumns<ProjectRow>[] = [
	{
		dataIndex: 'runId',
		title: 'Run ID',
	},
	{
		dataIndex: 'createdAt',
		title: 'createdAt',
		render: (_, record) => <DateWithFormat date={record.createdAt} />,
	},
	{
		dataIndex: 'status',
		title: 'status',
		render: (_, record) => record.status,
	},
	{
		dataIndex: 'detail',
		title: 'detail',
		render: (_, record) => <NoStyleLink to={`/run/${record.id}`}>detail</NoStyleLink>,
	},
];

const ProjectPageInner = () => {
	const { project } = useActiveProject();
	const getProjectRuns = trpc.run.getRuns.useQuery({ projectId: project?.id ?? 'TODO' });

	return (
		<PageContainer subTitle="Project">
			<ProCard>
				<ProTable<ProjectRow> columns={COLUMNS} dataSource={getProjectRuns.data} search={false} />
			</ProCard>
			<br />
			<ProCard>
				<RunsLengthHistoryChart />
			</ProCard>
		</PageContainer>
	);
};

export const ProjectPage = () => (
	<WithActiveProject>
		<ProjectPageInner />
	</WithActiveProject>
);
