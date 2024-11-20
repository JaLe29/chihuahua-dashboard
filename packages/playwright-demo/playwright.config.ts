/* eslint-disable prettier/prettier */
import { defineConfig, devices } from '@playwright/test';
import { type ChihuahuaReporterOptions } from '@chihuahua-dashboard/reporter';

const options: ChihuahuaReporterOptions = {
	api: {
		apiUrl: 'http://localhost:4000',
		apiToken: 'test',
	},
	runId: 'test',
};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	expect: {
		timeout: 30000,
	},
	timeout: 0.5 * 60 * 1000,
	testDir: './src',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : 10,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI
		? 'html'
		: [['html'], ["@chihuahua-dashboard/reporter", options]],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'https://demo.playwright.dev/todomvc/#/',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on',
		video:   process.env.CI ? 'off' : 'on',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		...(
			process.env.CI ? [
				{
					name: 'firefox',
					use: { ...devices['Desktop Firefox'] },
				},

				{
					name: 'webkit',
					use: { ...devices['Desktop Safari'] },
				},
				/* Test against branded browsers. */
				/* 	{
					name: 'Microsoft Edge',
					use: { ...devices['Desktop Edge'], channel: 'msedge' },
				}, */
				{
					name: 'Google Chrome',
					use: { ...devices['Desktop Chrome'], channel: 'chrome' },
				},
			] : []
		),

		/* Test against mobile viewports. */
		// {
		// name: 'Mobile Chrome',
		// use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },


	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3000',
	//   reuseExistingServer: !process.env.CI,
	// },
});
