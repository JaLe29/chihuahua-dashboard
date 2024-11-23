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

//
export const PAYLOAD = z.union([
	z.object({ action: z.literal('onBegin'), runId: z.string(), data: OnBeginPayload }),
	z.object({ action: z.literal('onEnd'), runId: z.string(), data: OnBeginPayload }),
]);

export type Payload = z.infer<typeof PAYLOAD>;
