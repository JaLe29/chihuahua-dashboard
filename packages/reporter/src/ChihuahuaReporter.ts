/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OnBeginPayload, Payload, TestStep as TestStepType } from '@chihuahua-dashboard/shared-api';
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

// s
/* eslint-disable no-console */
export class ChihuahuaReporter implements Reporter {
	private readonly runId = randomUUID();

	constructor(private readonly options: ChihuahuaReporterOptions) {}

	private simpleStringify(object: any) {
		return JSON.stringify(object);
	}

	private mapSteps(steps: TestStep[]): TestStepType[] {
		return steps.map(step => ({
			title: step.title,
			steps: this.mapSteps(step.steps),
			duration: step.duration,
			titlePath: step.titlePath(),
			category: step.category,
		}));
	}

	private async sendStep(payload: Omit<Payload, 'runId'>) {
		try {
			const stringPayload = this.simpleStringify({ ...payload, runId: this.runId });
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

				console.log(payload);
				process.exit(1);
			}
		} catch (error) {
			console.log(payload);
			console.log(this.simpleStringify(payload));
			console.error(error);
			process.exit(1);
		}
	}

	async onBegin(config: FullConfig, suite: Suite) {
		const tests = suite.allTests();

		const tetsPayload: OnBeginPayload = tests.map(test => ({
			id: test.id,
			title: test.title,
		}));

		await this.sendStep({
			action: 'onBegin',
			data: tetsPayload,
		});
	}

	async onTestBegin(test: TestCase) {
		await this.sendStep({
			action: 'onTestBegin',
			data: { id: test.id },
		});
	}

	async onTestEnd(test: TestCase, result: TestResult) {
		console.log(result.attachments);
		await this.sendStep({
			action: 'onTestEnd',
			data: { id: test.id, result: { duration: result.duration, status: result.status } },
		});
	}

	async onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
		await this.sendStep({
			action: 'onStepBegin',
			data: {
				id: test.id,
				step: {
					title: step.title,
					steps: this.mapSteps(step.steps),
					duration: step.duration,
					titlePath: step.titlePath(),
					category: step.category,
				},
				result: { duration: result.duration, status: result.status },
			},
		});
	}

	async onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
		await this.sendStep({
			action: 'onStepEnd',
			data: {
				id: test.id,
				step: {
					title: step.title,
					steps: this.mapSteps(step.steps),
					duration: step.duration,
					titlePath: step.titlePath(),
					category: step.category,
				},
				result: { duration: result.duration, status: result.status },
			},
		});
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
