import { useParams } from 'react-router-dom';
import { NoStyleLink } from '../components/NoStyleLink';

export const ProjectPage = () => {
	const { projectId } = useParams();

	// eslint-disable-next-line no-console
	console.log('ProjectPage', projectId);

	return (
		<div>
			ProjectPage<NoStyleLink to={`/project/${projectId}/config`}>Settings</NoStyleLink>
		</div>
	);
};
