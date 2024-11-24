/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OnBeginPayload, Payload } from '@chihuahua-dashboard/shared-api';
import type {
	FullConfig,
	FullResult,
	Reporter,
	Suite,
	TestCase,
	TestError,
	TestResult,
	TestStep,
} from '@playwright/test/reporter';
import { randomUUID } from 'crypto';
import type { ChihuahuaReporterOptions } from './types';

// types shared

// ------------------------------------------------------------

/* eslint-disable no-console */
export class ChihuahuaReporter implements Reporter {
	private readonly runId = randomUUID();

	constructor(private readonly options: ChihuahuaReporterOptions) {
		console.log('Reporter construchjjhdsadastorddsds dsdsadsadsa');
	}

	private async sendStep(payload: Omit<Payload, 'runId'>) {
		try {
			const stringPayload = JSON.stringify({ ...payload, runId: this.runId });
			const r = await fetch(`${this.options.api.apiUrl}/v1/playwright/step`, {
				method: 'POST',
				body: stringPayload,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${this.options.api.apiToken}`,
				},
			});

			if (!r.ok) {
				console.error(r.statusText);
				console.error(await r.text());
				console.log(stringPayload);
				process.exit(1);
			}
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}

	async onBegin(config: FullConfig, suite: Suite) {
		const tests = suite.allTests();

		console.log(tests);
		const tetsPayload: OnBeginPayload = tests.map(test => ({
			id: test.id,
			title: test.title,
		}));

		console.log(tetsPayload);

		await this.sendStep({
			action: 'onBegin',
			data: tetsPayload,
		});
	}

	async onTestBegin(test: TestCase) {
		await Promise.resolve();
	}

	async onTestEnd(test: TestCase, result: TestResult) {
		await Promise.resolve();
	}

	async onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
		await Promise.resolve();
	}

	async onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
		await Promise.resolve();
	}

	async onEnd(result: FullResult) {
		await this.sendStep({
			action: 'onEnd',
			data: { status: result.status, startTime: result.startTime, duration: result.duration },
		});
	}

	async onError(error: TestError) {
		await Promise.resolve();
	}
}
