import { useParams } from 'react-router-dom';

export const ProjectPage = () => {
	const { id } = useParams();

	console.log('ProjectPage', id);

	return <div>ProjectPage</div>;
};
