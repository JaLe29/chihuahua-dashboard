import { PageContainer, ProCard, ProForm, ProFormText, type ProFormInstance } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, Collapse, Divider, Modal, notification } from 'antd';
import { useRef } from 'react';
import { WithActiveProject } from '../components/WithActiveProject';
import { useActiveProject } from '../hooks/useActiveProject';
import { trpc } from '../utils/trpc';

type FormButtonProps = { loading: boolean } | undefined;

const ProjectSettingsPageInner: React.FC = () => {
	const updateProjectSettings = trpc.project.updateProjectSettings.useMutation();
	const regenerateProjectToken = trpc.project.regenerateProjectToken.useMutation();
	const { project } = useActiveProject();
	const getProjectToken = trpc.project.getProjectToken.useQuery({ id: project?.id ?? 'TODO' });
	const formRef = useRef<
		ProFormInstance<{
			maxTimeout: number;
			retention: number;
		}>
	>();
	const getProjectSettings = trpc.project.getProjectSettings.useQuery({ id: project?.id ?? 'TODO' });

	const handleRegenerateTokenClick = (): void => {
		Modal.confirm({
			title: 'Regenerate project token',
			content: 'Are you sure you want to regenerate the project token?',
			okText: 'Regenerate',
			okType: 'danger',
			cancelText: 'Cancel',
			onOk: async () => {
				await regenerateProjectToken.mutateAsync({ id: project?.id ?? 'TODO' });
				await getProjectToken.refetch();
				notification.success({
					message: 'Project token has been regenerated',
				});
			},
		});
	};

	if (getProjectSettings.isLoading) {
		return <div>Loading...</div>;
	}

	if (getProjectSettings.isError) {
		return <div>Error: {getProjectSettings.error.message}</div>;
	}

	const formDefaultData = getProjectSettings.data;

	return (
		<PageContainer subTitle="Project Settings">
			<ProCard>
				<ProForm<{
					name: string;
					description?: string;
				}>
					onFinish={async values => {
						await updateProjectSettings.mutateAsync({ id: project?.id ?? 'TODO', data: values });
						notification.success({
							message: 'Project settings have been updated',
						});
					}}
					formRef={formRef}
					initialValues={formDefaultData}
					submitter={{
						searchConfig: {
							resetText: 'Reset',
							submitText: 'Save',
						},
						render: props => (
							<div
								className={css`
									display: flex;
									justify-content: flex-end;
									gap: 8px;
								`}
							>
								<Button
									key="reset"
									onClick={() => props.form?.resetFields()}
									loading={(props.resetButtonProps as FormButtonProps)?.loading}
								>
									Reset
								</Button>
								<Button
									key="submit"
									type="primary"
									onClick={() => props.form?.submit()}
									loading={(props.submitButtonProps as FormButtonProps)?.loading}
								>
									Save
								</Button>
							</div>
						),
					}}
				>
					<ProForm.Group>
						<ProFormText
							name="name"
							label="Name"
							width="lg"
							required
							tooltip="Name of the project"
							placeholder="Name of the project"
							rules={[
								{
									required: true,
									message: 'Please specify name',
								},
							]}
						/>
					</ProForm.Group>
					<ProForm.Group>
						<ProFormText
							name="description"
							label="Description"
							width="lg"
							tooltip="Description of the project"
							placeholder="Description of the project"
						/>
					</ProForm.Group>
				</ProForm>
			</ProCard>
			<Divider />
			<ProCard>
				<Collapse
					items={[
						{
							label: 'API Token',
							key: '1',
							children: (
								<>
									<p>
										This api token is used for authentication when sending requests to the server
										from reporter
									</p>
									<p
										className={css`
											padding: 8px;
											background-color: #f0f5ff;
											border-radius: 4px;
										`}
									>
										<b>{getProjectToken.data?.token}</b>
									</p>
									<p
										className={css`
											display: flex;
											justify-content: flex-end;
											gap: 8px;
										`}
									>
										<Button danger onClick={handleRegenerateTokenClick}>
											Regenerate token
										</Button>
									</p>
								</>
							),
						},
					]}
				/>
			</ProCard>
		</PageContainer>
	);
};

export const ProjectSettingsPage = () => (
	<WithActiveProject>
		<ProjectSettingsPageInner />
	</WithActiveProject>
);
