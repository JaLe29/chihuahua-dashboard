import type {
	Reporter,
	TestCase,
	TestResult,
	TestError,
	FullResult,
	TestStep,
	FullConfig,
	Suite,
} from '@playwright/test/reporter';
import type { ChihuahuaReporterOptions } from './types';

// types shared

// ------------------------------------------------------------

/* eslint-disable no-console */
export class ChihuahuaReporter implements Reporter {
	private baseUrl: string;
	private results: any[] = [];
	private outputFile: string;

	constructor(private readonly options: ChihuahuaReporterOptions) {
		console.log('Reporter construchjjhdsadastorddsds dsdsadsadsa');
	}

	private async sendStep(action: string, payload: any) {
		try {
			const r = await fetch(`${this.options.api.apiUrl}/v1/playwright/step`, {
				method: 'POST',
				body: JSON.stringify({ action, payload: typeof payload === 'object' ? payload : { payload } }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			console.log(r);
			console.log(JSON.stringify({ action, payload: typeof payload === 'object' ? payload : { payload } }));

			if (!r.ok) {
				console.error(r.statusText);
				console.error(await r.text());
				process.exit(1);
			}
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}

	async onBegin(config: FullConfig, suite: Suite) {
		await this.sendStep('onBegin', {
			action: 'Starting the run',
			tests: suite.allTests().length,
		});

		console.log(`Starting the run with ${suite.allTests().length} tests`);
		console.log(`Base URL: ${this.baseUrl}`);
	}

	onTestBegin(test: TestCase) {
		console.log(`Starting test: ${test.title}`);
	}

	onTestEnd(test: TestCase, result: TestResult) {
		this.results.push({
			title: test.title,
			status: result.status,
			duration: result.duration,
			error: result.error?.message,
			url: `${this.baseUrl}${test.location.file}`,
		});
	}

	onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
		console.log(`Starting step: ${step.title}`);
	}

	onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
		console.log(`Finished step: ${step.title}`);
	}

	onEnd(result: FullResult) {
		console.log(`Finished the run: ${result.status}`);
	}

	onError(error: TestError) {
		console.log(`Error occurred: ${error.message}`);
	}
}
