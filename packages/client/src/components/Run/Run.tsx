/* eslint-disable react/no-array-index-key */
import { ProCard } from '@ant-design/pro-components';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { trpc } from '../../utils/trpc';
import { TestStatus } from '../TestStatus';
import type { Run as RunType } from './run.types';
import { getTestStatus } from './run.utils';
import { RunBody } from './RunBody';

interface Props {
	runId: string;
	runLogId: string;
}

export const Run: React.FC<Props> = ({ runId, runLogId }) => {
	const getRunItem = trpc.runLogs.getRunLogsAll.useQuery({ runId, runLogId });

	let iterator = 0;
	const tests = getRunItem.data?.reduce((acc, curr) => {
		if (!Array.isArray(acc[iterator])) {
			acc[iterator] = [];
		}

		if (curr.action === 'onTestBegin') {
			acc[iterator]!.push(curr);
		} else if (curr.action === 'onTestEnd') {
			acc[iterator]!.push(curr);
			iterator++;
		} else {
			acc[iterator]!.push(curr);
		}

		return acc;
	}, [] as RunType[][]);

	const items: TabsProps['items'] = tests?.map((test, index) => ({
		key: index.toString(),
		label: <TestStatus status={getTestStatus(test)} number={index + 1} key={index} />,
		children: <RunBody data={test} />,
	}));

	return (
		<ProCard loading={getRunItem.isLoading}>
			<Tabs defaultActiveKey="1" items={items} />
		</ProCard>
	);
};
