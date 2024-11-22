import { css } from '@emotion/css';
import { Link, type LinkProps } from 'react-router-dom';

interface Props extends LinkProps {}

export const NoStyleLink: React.FC<Props> = ({ children, to, ...props }) => {
	// const { hash } = useUrlHash();

	const toUrl = to;

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
