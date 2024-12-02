/* eslint-disable react/no-unstable-nested-components */
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';

import { useParams } from 'react-router-dom';
import { RealTime } from '../components/RealTime';
import { RunStatus } from '../components/RunStatus';
import { TestDuration } from '../components/TestDuration';
import { WithActiveProject } from '../components/WithActiveProject';
import { useActiveProject } from '../hooks/useActiveProject';
import { trpc } from '../utils/trpc';

const { Statistic, Divider } = StatisticCard;

const RunPageInner = () => {
	const { project } = useActiveProject();
	const { id: runId } = useParams();

	const getRun = trpc.run.getRun.useQuery({ projectId: project?.id ?? 'TODO', runId: runId ?? 'TODO' });

	// eslint-disable-next-line no-console
	console.log(getRun.data);

	const responsive = false;

	return (
		<PageContainer subTitle="Run">
			<ProCard>
				<StatisticCard.Group direction={responsive ? 'column' : 'row'}>
					<StatisticCard
						statistic={{
							title: '总流量(人次)',
							value: 601986875,
						}}
					/>
					<Divider type={responsive ? 'horizontal' : 'vertical'} />
					<StatisticCard
						statistic={{
							title: '付费流量',
							value: 3701928,
							description: <Statistic title="占比" value="61.5%" />,
						}}
						chart={
							<img
								src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
								alt="百分比"
								width="100%"
							/>
						}
						chartPlacement="left"
					/>
					<StatisticCard
						loading={getRun.isLoading}
						statistic={{
							title: 'Test state',
							value: '-', // using valueRender
							description: (
								<RealTime startTime={(getRun.data?.run.createdAt as unknown as Date) ?? new Date()} />
							),
							valueRender: () => {
								const createdAt = (getRun.data?.run.createdAt as unknown as Date) ?? new Date();
								const duration = getRun.data?.logs.onEnd?.duration;

								// eslint-disable-next-line no-console
								console.log(getRun.data);

								return (
									<TestDuration
										createdAt={createdAt}
										status={getRun.data?.run.status ?? 'running'}
										duration={duration}
									/>
								);
							},
						}}
						chart={getRun.data && <RunStatus status={getRun.data?.run.status} />}
						chartPlacement="left"
					/>
				</StatisticCard.Group>
			</ProCard>
		</PageContainer>
	);
};

export const RunPage = () => (
	<WithActiveProject>
		<RunPageInner />
	</WithActiveProject>
);
