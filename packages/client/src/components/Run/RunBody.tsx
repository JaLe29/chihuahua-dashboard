/* eslint-disable react/no-array-index-key */
import { Divider, Statistic } from 'antd';
import type { RunStep, Run as RunType } from './run.types';
import { getOnTestEnd } from './run.utils';
import { RunTimeline } from './RunTimeline';

interface Props {
	data: RunType[];
}

export const RunBody: React.FC<Props> = ({ data }) => {
	const onTestEnd = getOnTestEnd(data);

	const steps = data
		.map(i => {
			const step = (i.data as any).step as RunStep;

			if (!step) {
				return undefined;
			}

			const hasSteps = step?.steps?.length > 0;

			if (hasSteps) {
				return [...step.steps];
			}

			return [step];
		})
		.filter(Boolean)
		.flat() as RunStep[];

	// eslint-disable-next-line no-console
	console.log({ steps, data });

	interface Step {
		title: string;
		steps: Step[];
		duration: number;
		titlePath: string[];
		category: string;
	}

	interface Action {
		data: {
			id: string;
			step?: Step;
			result?: {
				duration: number;
				status: string;
			};
		};
		action: string;
		createdAt: string;
	}

	interface GroupedStep {
		titlePath: string[];
		steps: Step[];
	}

	function groupStepsByTitlePath(actions: Action[]): GroupedStep[] {
		const groupedSteps: Map<string, { titlePath: string[]; steps: Step[] }> = new Map();

		actions.forEach(action => {
			const { step } = action.data;
			if (step && step.titlePath) {
				const pathKey = step.titlePath.join(' > ');
				if (!groupedSteps.has(pathKey)) {
					groupedSteps.set(pathKey, { titlePath: step.titlePath, steps: [] });
				}

				groupedSteps.get(pathKey)?.steps.push(step);
			}
		});

		// Vrací pole, které reflektuje pořadí, ve kterém byly kroky zpracovány
		return Array.from(groupedSteps.values());
	}

	// Volání funkce
	const grouped = groupStepsByTitlePath(data as any);

	return (
		<div>
			<Statistic title="Active Users" value={onTestEnd?.result.duration ?? -1} />
			<Divider />
			<RunTimeline data={grouped as any} />
		</div>
	);
};
