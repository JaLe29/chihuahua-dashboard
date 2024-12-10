/* eslint-disable react/no-array-index-key */
import { Timeline } from 'antd';
import type { RunStep } from './run.types';

interface Props {
	data: RunStep[];
}

export const RunTimeline: React.FC<Props> = ({ data }) => (
	<Timeline
		items={data
			.map(step => {
				const hasSteps = step.steps?.length > 0;

				if (hasSteps) {
					return [
						{ children: step.title },
						{
							children: (
								<>
									<br />
									<br />
									<RunTimeline data={step.steps} />
								</>
							),
						},
					];
				}

				return { children: `${step.title} (${step.status ?? 'no status'}) (${step.duration})` };
			})
			.flat()}
	/>
);
