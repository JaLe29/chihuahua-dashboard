/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
import { Space } from 'antd';
import type { RouterOutput } from '../../utils/trpc';
import { TestStatus } from '../TestStatus';

interface Props {
	log: RouterOutput['runLogs']['getRunLogs'][number];
}

export const RunLogHeader: React.FC<Props> = ({ log }) => {
	const runs: RouterOutput['runLogs']['getRunLogs'][number]['data'][] = [];

	let iterator = 0;

	for (const item of log.data) {
		if (item.action === 'onTestBegin') {
			runs.push([item]);
		} else {
			runs[iterator]!.push(item);
			iterator++;
		}
	}

	return (
		<Space size={[8, 16]} wrap>
			<div>{log.title}</div>
			<div>
				{runs.map((r, index) => {
					const number = index + 1;

					if (r.length === 2) {
						const onTestEnd = r[1] as Extract<
							RouterOutput['runLogs']['getRunLogs'][number]['data'][number],
							{ result: any }
						>;

						return <TestStatus status={onTestEnd.result.status} number={number} key={index} />;
					}

					return <TestStatus status="running" number={number} key={index} />;
				})}
			</div>
		</Space>
	);
};
