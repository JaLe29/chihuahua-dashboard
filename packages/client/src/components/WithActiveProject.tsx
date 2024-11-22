import { ProCard } from '@ant-design/pro-components';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { useActiveProject } from '../hooks/useActiveProject';

interface Props {
	children: React.ReactNode;
}

export const WithActiveProject: React.FC<Props> = ({ children }) => {
	const { activeProjectId } = useActiveProject();

	if (!activeProjectId) {
		return (
			<ProCard>
				<Result
					title="No active project, please create or select a project"
					extra={
						<Link to="/">
							<Button type="primary" key="console">
								Go to projects
							</Button>
						</Link>
					}
				/>
			</ProCard>
		);
	}

	return <>{children}</>;
};
