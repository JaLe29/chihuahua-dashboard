/* eslint-disable jsx-a11y/anchor-is-valid */
import { ProCard } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Collapse, Divider } from 'antd';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Run } from '../Run/Run';
import { RunLogHeader } from './RunLogHeader';

interface Props {
	runId: string;
}

export const RunLogs: React.FC<Props> = ({ runId }) => {
	const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});
	const getRunLogs = trpc.runLogs.getRunLogs.useQuery({ runId });

	const handlePanelChange = (keys: string[]) => {
		setExpandedRowKeys(prev => {
			const newState = { ...prev };

			keys.forEach(key => {
				newState[key] = true;
			});

			return newState;
		});
	};

	const items = getRunLogs.data
		?.filter(item => !!item.id)
		.map(item => ({
			key: item.id,
			label: <RunLogHeader log={item} />,
			children: expandedRowKeys[item.id] ? (
				<>
					<Divider
						className={css`
							margin-top: 0;
							margin-bottom: 12px;
						`}
					/>

					<Run runId={runId} runLogId={item.id} />
				</>
			) : null,
		}));

	return (
		<ProCard>
			<Collapse items={items} bordered={false} onChange={handlePanelChange} />
		</ProCard>
	);
};
