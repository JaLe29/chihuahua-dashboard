import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { useParams } from 'react-router-dom';
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
						statistic={{
							title: '免费流量',
							value: 1806062,
							description: <Statistic title="占比" value="38.5%" />,
						}}
						chart={
							<img
								src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
								alt="百分比"
								width="100%"
							/>
						}
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
