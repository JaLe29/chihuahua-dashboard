import type { RouterOutput } from '../../utils/trpc';

export type TestStatus =
	| Extract<RouterOutput['runLogs']['getRunLogs'][number]['data'][number], { result: any }>['result']['status']
	| 'running';
