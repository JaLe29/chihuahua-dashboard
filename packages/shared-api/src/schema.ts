/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { z } from 'zod';

export const ACTION = z.enum([
	'onBegin',
	'onStep',
	'onError',
	'onTestBegin',
	'onEnd',
	'onStepEnd',
	'onStepBegin',
	'onTestEnd',
]);

export type Action = z.infer<typeof ACTION>;

//

export const TestStep: z.ZodType<{
	title: string;
	steps: Array<{ title: string; steps: TestStep[]; duration: number; titlePath: string[]; category: string }>;
	duration: number;
	titlePath: string[];
	category: string;
}> = z.lazy(() =>
	z.object({
		title: z.string(),
		steps: z.array(TestStep),
		duration: z.number(),
		titlePath: z.array(z.string()),
		category: z.string(),
	}),
);

export type TestStep = z.infer<typeof TestStep>;

export const Result = z.object({
	duration: z.number(),
	status: z.enum(['passed', 'failed', 'interrupted', 'timedOut', 'skipped']),
});

export type Result = z.infer<typeof Result>;

//

export const OnBeginPayload = z.array(z.object({ id: z.string(), title: z.string() }));

export type OnBeginPayload = z.infer<typeof OnBeginPayload>;

export const OnTestBeginPayload = z.object({ id: z.string() });

export type OnTestBeginPayload = z.infer<typeof OnTestBeginPayload>;

export const OnTestEndPayload = z.object({
	id: z.string(),
	result: Result,
});

export type OnTestEndPayload = z.infer<typeof OnTestEndPayload>;

//

export const OnEndPayload = z.object({
	status: z.enum(['passed', 'failed', 'timedout', 'interrupted']),
	startTime: z.coerce.date(),
	duration: z.number(),
});

export type OnEndPayload = z.infer<typeof OnEndPayload>;

export const OnStepBeginPayload = z.object({ id: z.string(), step: TestStep });

export type OnStepBeginPayload = z.infer<typeof OnStepBeginPayload>;

export const OnStepEndPayload = z.object({ id: z.string(), step: TestStep, result: Result });

export type OnStepEndPayload = z.infer<typeof OnStepEndPayload>;

export const PAYLOAD = z.union([
	z.object({ action: z.literal('onBegin'), runId: z.string(), data: OnBeginPayload }),
	z.object({ action: z.literal('onEnd'), runId: z.string(), data: OnEndPayload }),
	z.object({ action: z.literal('onTestBegin'), runId: z.string(), data: OnTestBeginPayload }),
	z.object({ action: z.literal('onTestEnd'), runId: z.string(), data: OnTestEndPayload }),
	z.object({ action: z.literal('onStepBegin'), runId: z.string(), data: OnStepBeginPayload }),
	z.object({ action: z.literal('onStepEnd'), runId: z.string(), data: OnStepEndPayload }),
]);

export type Payload = z.infer<typeof PAYLOAD>;
