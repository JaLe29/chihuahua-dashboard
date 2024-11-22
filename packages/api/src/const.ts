import { ACTION, PAYLOAD } from '@chihuahua-dashboard/shared-api';
import { z } from 'zod';

export const IN_PAYLOAD = z.object({
	action: ACTION,
	payload: PAYLOAD,
});

export type InPayload = z.infer<typeof IN_PAYLOAD>;
