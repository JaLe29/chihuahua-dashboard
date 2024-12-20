/* eslint-disable react/no-array-index-key */
import { Divider, Statistic } from 'antd';
import type { Action, GroupedStep, RunStep, Run as RunType, Step } from './run.types';
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
	const cleaned = grouped.map(i => {
		const loopSteps = i.steps ?? [];
		const newSteps = [] as Step[];

		for (let j = 0; j < loopSteps.length; j++) {
			const currentStep = loopSteps[j]!;
			const currentTitle = currentStep.title;
			const nextStep = loopSteps[j + 1];
			const nextTitle = nextStep?.title;

			if (currentTitle === nextTitle && nextTitle) {
				j++;
				newSteps.push(nextStep);
			} else {
				newSteps.push(currentStep);
			}
		}

		return {
			...i,
			steps: newSteps,
		};
	});

	return (
		<div>
			<Statistic title="Duration" value={onTestEnd?.result.duration ?? -1} />
			<Divider />
			<RunTimeline data={cleaned} />
		</div>
	);
};
