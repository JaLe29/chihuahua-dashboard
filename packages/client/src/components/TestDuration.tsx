import { css } from '@emotion/css';
import dayjs from 'dayjs';
import type { RunStatus } from '../types';
import { RealTime } from './RealTime';

interface Props {
	createdAt: Date;
	status: RunStatus;
	duration?: number;
}

export const TestDuration: React.FC<Props> = ({ createdAt, status, duration }) => {
	if (status === 'running') {
		return <RealTime startTime={createdAt} />;
	}

	return (
		<div
			className={css`
				color: green;
				font-weight: bold;
			`}
		>
			{dayjs.duration(duration ?? 0).format('HH:mm:ss')}
		</div>
	);
};
