/* eslint-disable react/no-unstable-nested-components */
import { Pie } from '@ant-design/plots';
import { StatisticCard } from '@ant-design/pro-components';
import { useActiveProject } from '../hooks/useActiveProject';
import { trpc } from '../utils/trpc';
import { RunStatus } from './RunStatus';
import { TestDuration } from './TestDuration';

interface Props {
	runId: string;
}

export const RunHeader: React.FC<Props> = ({ runId }) => {
	const { project } = useActiveProject();
	const getRunHeader = trpc.run.getRunHeader.useQuery({ projectId: project?.id ?? 'TODO', runId: runId ?? 'TODO' });

	const responsive = false;

	const onBegin = getRunHeader.data?.logs.onBegin;

	return (
		<StatisticCard.Group direction={responsive ? 'column' : 'row'} loading={getRunHeader.isLoading}>
			<StatisticCard
				statistic={{
					title: 'Test Cases',
					value: onBegin?.length ?? 0,
				}}
				chart={
					<div style={{ width: 200, height: 200 }}>
						<Pie
							data={[{ type: 'Total', value: getRunHeader.data?.totalTests }]}
							angleField="value"
							colorField="type"
							autoFit
							label={{
								text: 'value',
								style: {
									fontWeight: 'bold',
								},
							}}
							legend={false}
							tooltip={[
								{
									field: 'type',
									name: 'Type',
								},
								{
									field: 'value',
									name: 'Value',
								},
							]}
						/>
					</div>
				}
				chartPlacement="left"
			/>
			<StatisticCard
				loading={getRunHeader.isLoading}
				statistic={{
					title: 'Test state',
					value: '-', // using valueRender ,
					valueRender: () => {
						const createdAt = (getRunHeader.data?.run.createdAt as unknown as Date) ?? new Date();
						const duration = getRunHeader.data?.logs.onEnd?.duration;

						return (
							<TestDuration
								createdAt={createdAt}
								status={getRunHeader.data?.run.status ?? 'running'}
								duration={duration}
							/>
						);
					},
				}}
				chart={getRunHeader.data && <RunStatus status={getRunHeader.data?.run.status} />}
				chartPlacement="left"
			/>
		</StatisticCard.Group>
	);
};
