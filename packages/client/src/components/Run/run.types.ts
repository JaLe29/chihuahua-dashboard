import type { RouterOutput } from '../../utils/trpc';

export type Run = RouterOutput['runLogs']['getRunLogsAll'][number];

export type RunPayload<T extends string> = Extract<
	RouterOutput['runLogs']['getRunLogs'][number]['data'][number],
	{ action: T }
>;
