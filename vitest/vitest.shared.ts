import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'
import swc from 'unplugin-swc';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defaultExclude } from 'vitest/config'

const isCI = process.env.CI === 'true';

const EXCLUDE_FILES = ['**/index.ts', '**/*.d.ts', ...defaultExclude];

console.log(`Running test in CI environment: ${isCI}`);

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		react(),
		// Since ESbuild doesn't support decorators, we use SWC for testing
		swc.vite({
			jsc: {
				transform: {
					react: {
						runtime: 'automatic',
					},
				},
			},
		})
	],
	test: {
		environment: 'jsdom',
		globals: true,
		minWorkers: 1,
		...(isCI && { maxWorkers: 2 }),
		setupFiles: [
			path.resolve(__dirname, 'vitest.setup.ts'),
			path.resolve(__dirname, 'vitest.client.setup.tsx'),
		],
		exclude: EXCLUDE_FILES,
		coverage: {
			exclude: EXCLUDE_FILES,
		},
	},
})