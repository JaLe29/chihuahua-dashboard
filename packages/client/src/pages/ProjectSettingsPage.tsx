import { PageContainer, ProCard, ProForm, ProFormText, type ProFormInstance } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button } from 'antd';
import { useRef } from 'react';
import { WithActiveProject } from '../components/WithActiveProject';
import { useActiveProject } from '../hooks/useActiveProject';
import { trpc } from '../utils/trpc';

type FormButtonProps = { loading: boolean } | undefined;

const ProjectSettingsPageInner: React.FC = () => {
	const updateProjectSettings = trpc.project.updateProjectSettings.useMutation();
	const { activeProjectId } = useActiveProject();
	const formRef = useRef<
		ProFormInstance<{
			maxTimeout: number;
			retention: number;
		}>
	>();
	const getProjectSettings = trpc.project.getProjectSettings.useQuery({ id: activeProjectId ?? 'TODO' });

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
						await updateProjectSettings.mutateAsync({ id: activeProjectId ?? 'TODO', data: values });
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
						/>
					</ProForm.Group>
				</ProForm>
			</ProCard>
		</PageContainer>
	);
};

export const ProjectSettingsPage = () => (
	<WithActiveProject>
		<ProjectSettingsPageInner />
	</WithActiveProject>
);
