import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface Props {
	startTime: Date;
}

export const RealTime: React.FC<Props> = ({ startTime }) => {
	const [time, setTime] = useState(dayjs.duration(dayjs().diff(startTime)));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(dayjs.duration(dayjs().diff(startTime)));
		}, 100);

		return () => clearInterval(interval);
	}, [startTime]);

	const formatted = [
		String(time.hours()).padStart(2, '0'),
		String(time.minutes()).padStart(2, '0'),
		String(time.seconds()).padStart(2, '0'),
	].join(':');

	return formatted;
};
