import { PageContainer, ProCard, ProForm, ProFormDigit, type ProFormInstance } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button } from 'antd';
import { useRef } from 'react';
import { WithActiveProject } from '../components/WithActiveProject';
import { useActiveProject } from '../hooks/useActiveProject';
import { trpc } from '../utils/trpc';

type FormButtonProps = { loading: boolean } | undefined;

const ProjectConfigPageInner: React.FC = () => {
	const updateConfig = trpc.projectConfig.updateConfig.useMutation();
	const { activeProjectId } = useActiveProject();
	const formRef = useRef<
		ProFormInstance<{
			maxTimeout: number;
			retention: number;
		}>
	>();
	const getConfig = trpc.projectConfig.getConfig.useQuery({ id: activeProjectId ?? 'TODO' });

	if (getConfig.isLoading) {
		return <div>Loading...</div>;
	}

	if (getConfig.isError) {
		return <div>Error: {getConfig.error.message}</div>;
	}

	const formDefaultData = getConfig.data;

	return (
		<PageContainer subTitle="Project Configuration">
			<ProCard>
				<ProForm<{
					maxTimeout: number;
					retention: number;
				}>
					onFinish={async values => {
						await updateConfig.mutateAsync({ id: activeProjectId ?? 'TODO', data: values });
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
						<ProFormDigit
							name="maxTimeout"
							label="Max timeout"
							width="lg"
							required
							min={1}
							tooltip="Test execution timeout value (minutes). Serves as a failsafe mechanism to terminate tests that exceed the specified duration, protecting against non-terminating tests."
							placeholder="Test execution timeout value (minutes)"
							rules={[
								{
									required: true,
									message: 'Please specify maximum timeout',
								},
							]}
						/>
					</ProForm.Group>
					<ProForm.Group>
						<ProFormDigit
							name="retention"
							label="Retention"
							width="lg"
							required
							min={1}
							tooltip="Data retention period (days) for test execution results. Determines the automatic cleanup interval for historical test data. Older records will be permanently deleted to maintain system performance and storage efficiency."
							placeholder="Data retention period (days)"
							rules={[
								{
									required: true,
									message: 'Please specify max retention',
								},
							]}
						/>
					</ProForm.Group>
				</ProForm>
			</ProCard>
		</PageContainer>
	);
};

export const ProjectConfigPage = () => (
	<WithActiveProject>
		<ProjectConfigPageInner />
	</WithActiveProject>
);
