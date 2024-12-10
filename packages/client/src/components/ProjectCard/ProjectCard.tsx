import { SunFilled, SunOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, theme } from 'antd';
import { useState } from 'react';
import { useActiveProject } from '../../hooks/useActiveProject';
import { type RouterOutput } from '../../utils/trpc';

interface Props {
	project: RouterOutput['project']['getProjects'][number];
}

export const ProjectCard: React.FC<Props> = ({ project }) => {
	const [loading, setLoading] = useState(false);
	const { token } = theme.useToken();
	const { project: activeProject, setProject } = useActiveProject();

	const isActive = project.id === activeProject?.id;

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
					loading={loading}
					onClick={async () => {
						if (isActive) {
							return;
						}

						setLoading(true);
						await setProject(project.id);
						setLoading(false);
					}}
				/>
			}
		>
			<div>{project.description}</div>
		</ProCard>
	);
};
