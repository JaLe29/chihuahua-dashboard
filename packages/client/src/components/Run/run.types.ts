import type { RouterOutput } from '../../utils/trpc';

export type Run = RouterOutput['runLogs']['getRunLogsAll'][number];

export type RunPayload<T extends string> = Extract<
	RouterOutput['runLogs']['getRunLogs'][number]['data'][number],
	{ action: T }
>;

export type RunStep = {
	title: string;
	steps: Array<{
		title: string;
		steps: RunStep[];
		duration: number;
		status: 'skipped' | 'passed' | 'failed'; // ??
	}>;
	duration: number;
	status: 'skipped' | 'passed' | 'failed'; // ??
};

//

export interface Step {
	title: string;
	steps: Step[];
	duration: number;
	titlePath: string[];
	category: string;
}

export interface Action {
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

export interface GroupedStep {
	titlePath: string[];
	steps: Step[];
}
