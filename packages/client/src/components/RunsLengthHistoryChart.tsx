import { Line } from '@ant-design/plots';
import { useActiveProject } from '../hooks/useActiveProject';
import { useFormatedDate } from '../hooks/useFormatedDate';
import { trpc } from '../utils/trpc';

export const RunsLengthHistoryChart = () => {
	const formatedDate = useFormatedDate();
	const { project } = useActiveProject();
	const getRunsLengthHistory = trpc.run.getRunsLengthHistory.useQuery({ id: project?.id ?? 'TODO' });

	/* 	const data = [
		{ createdAt: '1991', value: 3 },
	]; */

	const data = getRunsLengthHistory.data?.map(run => ({
		createdAt: formatedDate(run.createdAt),
		duration: run.duration,
	}));

	return (
		<Line
			style={{ lineWidth: 2 }}
			loading={getRunsLengthHistory.isLoading}
			title="Runs length history"
			data={data}
			xField="createdAt"
			yField="duration"
			axis={{
				x: {
					title: 'Date',
					label: {
						rotate: 45,
					},
				},
				y: {
					title: 'Duration [ms]',
				},
			}}
			point={{
				shapeField: 'circle',
				sizeField: 4,
			}}
			tooltip={[
				{
					field: 'duration',
					name: 'Duration',
				},
				{
					field: 'createdAt',
					name: 'Date',
				},
			]}
		/>
	);
};
