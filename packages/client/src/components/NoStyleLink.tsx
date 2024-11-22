import { css } from '@emotion/css';
import { Link, type LinkProps } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';

interface Props extends LinkProps {}

export const NoStyleLink: React.FC<Props> = ({ children, to, ...props }) => {
	const { activeProjectId } = useActiveProject();

	const toUrl = activeProjectId ? `${to}#${activeProjectId}` : to;

	return (
		<Link
			{...props}
			to={toUrl}
			className={css`
				color: inherit;
				text-decoration: inherit;
			`}
		>
			{children}
		</Link>
	);
};
