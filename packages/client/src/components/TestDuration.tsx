import { css } from '@emotion/css';
import dayjs from 'dayjs';
import type { RunStatus } from '../types';
import { RealTime } from './RealTime';

interface Props {
	createdAt: Date;
	status: RunStatus;
	duration?: number;
	durationTimeout?: number;
}

export const TestDuration: React.FC<Props> = ({ createdAt, status, duration, durationTimeout }) => {
	if (status === 'running') {
		return <RealTime startTime={createdAt} />;
	}

	if (status === 'timeout') {
		return (
			<div
				className={css`
					color: red;
					font-weight: bold;
				`}
			>
				{dayjs.duration(durationTimeout ?? 0).format('HH:mm:ss')}
			</div>
		);
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
