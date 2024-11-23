import { z } from 'zod';
import type { ProjectConfig } from './types';

export const ID = z.string().regex(/^[0-9a-f]{24}$/);

export const CREATE_PROJECT_SCHEMA = z
	.object({
		name: z.string(),
		description: z.string().optional(),
	})
	.strict();

export const PROJECT_CONFIG_SCHEMA: z.ZodType<ProjectConfig> = z
	.object({
		maxTimeout: z.number(),
		retention: z.number(),
		dateFormat: z.string(),
	})
	.strict();
