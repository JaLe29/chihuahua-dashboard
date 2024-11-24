import dayjs from 'dayjs';
import { useActiveProject } from './useActiveProject';

export const useFormatedDate = () => {
	const { project } = useActiveProject();

	return (date: Date | string) => {
		if (!project) {
			return '-';
		}

		return dayjs(date).format(project.config.dateFormat);
	};
};
