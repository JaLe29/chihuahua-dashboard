import dotenv from 'dotenv';
import path from 'path';

export const loadEnv = () => {
	const envPath = path.resolve(process.cwd(), '../../.env');

	dotenv.config({ path: envPath });
};

export const getRequiredNumber = (key: string, defaultValue?: number): number => {
	const v = process.env[key] ? Number(process.env[key]) : defaultValue;

	if (v === undefined) {
		throw new Error(`Required environment variable ${key} is not set`);
	}

	return v;
};

export const getRequiredString = (key: string, defaultValue?: string): string => {
	const v = process.env[key] ?? defaultValue;

	if (v === undefined) {
		throw new Error(`Required environment variable ${key} is not set`);
	}

	return v;
};
