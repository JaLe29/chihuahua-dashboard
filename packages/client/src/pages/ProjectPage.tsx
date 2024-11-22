import { Link, useParams } from 'react-router-dom';

export const ProjectPage = () => {
	const { projectId } = useParams();

	// eslint-disable-next-line no-console
	console.log('ProjectPage', projectId);

	return (
		<div>
			ProjectPage<Link to={`/project/${projectId}/config`}>Settings</Link>
		</div>
	);
};
