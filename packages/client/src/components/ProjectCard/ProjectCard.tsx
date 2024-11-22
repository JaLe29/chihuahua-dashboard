import { SunFilled, SunOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, theme } from 'antd';
import { useActiveProject } from '../../hooks/useActiveProject';
import { type RouterOutput } from '../../utils/trpc';

interface Props {
	project: RouterOutput['project']['getProjects'][number];
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
	const { token } = theme.useToken();
	const { activeProjectId, setActiveProject } = useActiveProject();

	const isActive = project.id === activeProjectId;

	return (
		<ProCard
			className={css`
				border: 1px solid ${isActive ? token.colorInfoActive : token.colorBorder};
			`}
			title={project.name}
			bordered
			extra={
				<Button
					shape="circle"
					type={isActive ? 'primary' : 'default'}
					icon={isActive ? <SunFilled /> : <SunOutlined />}
					onClick={() => setActiveProject(project.id, project.name)}
				/>
			}
		>
			<div>{project.description}</div>
		</ProCard>
	);
};
