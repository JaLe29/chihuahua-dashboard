import { ClockCircleTwoTone, FlagTwoTone, LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';
import type { RunStatus as RunStatusType } from '../types';

const RUN_STATUS_COMPONENT: Record<RunStatusType, React.ReactElement> = {
	running: (
		<Tooltip title="Test is in progress">
			<Spin indicator={<LoadingOutlined spin />} />
		</Tooltip>
	),
	finished: (
		<Tooltip title="The test is completed">
			<FlagTwoTone twoToneColor="#52c41a" />
		</Tooltip>
	),
	timeout: (
		<Tooltip title="Test ended with a timeout">
			<ClockCircleTwoTone twoToneColor="#fa541c" />
		</Tooltip>
	),
};

interface Props {
	status: RunStatusType;
}

export const RunStatus: React.FC<Props> = ({ status }) => RUN_STATUS_COMPONENT[status];
