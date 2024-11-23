import dayjs from 'dayjs';
import { useActiveProject } from '../hooks/useActiveProject';

interface Props {
	date: string;
}

export const DateWithFormat = ({ date }: Props) => {
	const { project } = useActiveProject();
	if (!project) {
		return <>-</>;
	}

	return <>{dayjs(date).format(project.config.dateFormat)}</>;
};
