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

export const OnBeginPayload = z.array(z.object({ id: z.string(), title: z.string() }));

export type OnBeginPayload = z.infer<typeof OnBeginPayload>;

export const OnTestBeginPayload = z.object({ id: z.string() });

export type OnTestBeginPayload = z.infer<typeof OnTestBeginPayload>;

export const OnTestEndPayload = z.object({
	id: z.string(),
	result: z.object({
		duration: z.number(),
		status: z.enum(['passed', 'failed', 'interrupted', 'timedOut', 'skipped']),
	}),
});

export type OnTestEndPayload = z.infer<typeof OnTestEndPayload>;

export const OnEndPayload = z.object({
	status: z.enum(['passed', 'failed', 'timedout', 'interrupted']),
	startTime: z.coerce.date(),
	duration: z.number(),
});

export type OnEndPayload = z.infer<typeof OnEndPayload>;

export const PAYLOAD = z.union([
	z.object({ action: z.literal('onBegin'), runId: z.string(), data: OnBeginPayload }),
	z.object({ action: z.literal('onEnd'), runId: z.string(), data: OnEndPayload }),
	z.object({ action: z.literal('onTestBegin'), runId: z.string(), data: OnTestBeginPayload }),
	z.object({ action: z.literal('onTestEnd'), runId: z.string(), data: OnTestEndPayload }),
]);

export type Payload = z.infer<typeof PAYLOAD>;
