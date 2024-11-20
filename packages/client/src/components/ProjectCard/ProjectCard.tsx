import type { MenuProps } from 'antd';
import { Button, Card, Dropdown, Modal, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { trpc, type RouterOutput } from '../../utils/trpc';

interface Props {
	project: RouterOutput['project']['getProjects'][number];
	refetch: () => Promise<void>;
}

export const ProjectCard: React.FC<Props> = ({ project, refetch }) => {
	const deleteProject = trpc.project.deleteProject.useMutation();

	const handleDeleteProject = async (): Promise<void> => {
		await deleteProject.mutateAsync({ id: project.id });
		await refetch();
	};

	const items: MenuProps['items'] = [
		{
			key: '4',
			danger: true,
			label: 'Delete project',
			onClick: () => {
				Modal.confirm({
					title: 'Delete project',
					content: 'Are you sure you want to delete this project?',
					okText: 'Delete',
					okType: 'danger',
					cancelText: 'Cancel',
					onOk: async () => {
						await handleDeleteProject();
					},
				});
			},
		},
	];

	return (
		<Card
			title={project.name}
			extra={
				<Dropdown menu={{ items }}>
					<Button type="link">
						<Space>...</Space>
					</Button>
				</Dropdown>
			}
			actions={[
				<Link key="view" to={`/project/${project.id}`}>
					<EyeOutlined />
				</Link>,
			]}
		>
			<p>Card content</p>
			<p>Card content</p>
			<p>Card content</p>
		</Card>
	);
};
