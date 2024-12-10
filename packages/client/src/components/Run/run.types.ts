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
