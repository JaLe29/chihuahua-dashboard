import { z } from 'zod';

export const ACTION = z.enum([
	'onBegin',
	'onEnd',
	'onStep',
	'onError',
	'onTestBegin',
	'onEnd',
	'onStepEnd',
	'onStepBegin',
	'onTestEnd',
]);

export type Action = z.infer<typeof ACTION>;

export const PAYLOAD = z.any();

export type Payload = z.infer<typeof PAYLOAD>;
