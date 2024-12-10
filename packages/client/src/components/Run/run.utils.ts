import type { RouterOutput } from '../../utils/trpc';
import type { TestStatus as TestStatusType } from '../types/test';
import type { Run as RunType } from './run.types';

export type Foo = RouterOutput['runLogs']['getRunLogs'][number];

export const getOnTestEnd = (test: RunType[]) => {
	const onTestEnd = test.find(t => t.action === 'onTestEnd');

	return onTestEnd?.data;
};

export const getTestStatus = (test: RunType[]): TestStatusType => {
	const onTestEnd = getOnTestEnd(test);

	return onTestEnd?.result.status ?? 'running';
};
