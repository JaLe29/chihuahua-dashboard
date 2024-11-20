import { useParams } from 'react-router-dom';

export const ProjectPage = () => {
	const { id } = useParams();

	// eslint-disable-next-line no-console
	console.log('ProjectPage', id);

	return <div>ProjectPage</div>;
};
