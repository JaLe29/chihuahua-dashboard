/* eslint-disable react/no-array-index-key */
import { Divider, Statistic } from 'antd';
import type { Run as RunType } from './run.types';
import { getOnTestEnd } from './run.utils';

interface Props {
	data: RunType[];
}

export const RunBody: React.FC<Props> = ({ data }) => {
	const onTestEnd = getOnTestEnd(data);

	return (
		<div>
			<Statistic title="Active Users" value={onTestEnd?.result.duration ?? -1} />
			<Divider />
			{data.map((run, index) => (
				<div key={index}>
					<div>{JSON.stringify(run, null, 2)}</div>
					<Divider />
				</div>
			))}
		</div>
	);
};
