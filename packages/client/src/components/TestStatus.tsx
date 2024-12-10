import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DoubleRightOutlined,
	FieldTimeOutlined,
	StopOutlined,
	SyncOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { capitalCase } from 'change-case';
import React from 'react';
import type { TestStatus as TestStatusType } from './types/test';

interface Props {
	status: TestStatusType;
	number: number;
}

export const TestStatus: React.FC<Props> = ({ status, number }) => {
	const withTooltip = (element: React.ReactElement) => <Tooltip title={capitalCase(status)}>{element}</Tooltip>;

	switch (status) {
		case 'failed':
			return withTooltip(
				<Tag icon={<CloseCircleOutlined />} color="error">
					{number}
				</Tag>,
			);
		case 'passed':
			return withTooltip(
				<Tag icon={<CheckCircleOutlined />} color="success">
					{number}
				</Tag>,
			);
		case 'timedOut':
			return withTooltip(
				<Tag icon={<FieldTimeOutlined />} color="warning">
					{number}
				</Tag>,
			);
		case 'skipped':
			return withTooltip(
				<Tag icon={<DoubleRightOutlined />} color="processing">
					{number}
				</Tag>,
			);
		case 'interrupted':
			return withTooltip(
				<Tag icon={<StopOutlined />} color="processing">
					{number}
				</Tag>,
			);
		case 'running':
			return withTooltip(
				<Tag icon={<SyncOutlined spin />} color="processing">
					{number}
				</Tag>,
			);
	}

	return 'Component not found';
};
