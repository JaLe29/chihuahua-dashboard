import { z } from 'zod';

export const ID = z.string().regex(/^[0-9a-f]{24}$/);

export const CREATE_PROJECT_SCHEMA = z.object({
	name: z.string(),
	description: z.string().optional(),
});
