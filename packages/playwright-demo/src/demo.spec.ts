import test, { expect } from '@playwright/test';

let iterator = 0;

test('demo 1-1', async ({ page }) => {
	if (iterator !== 0) {
		await page.goto('https://demo.playwright.dev/todomvc/#/');

		await expect(page.locator('body')).toContainText(
			'This is just a demo of TodoMVC for testing, not the real TodoMVC app.',
		);
	}

	iterator++;
	await expect(page.locator('body')).toContainText('x');
});

test('demo 2-1', async ({ page }) => {
	await page.goto('https://demo.playwright.dev/todomvc/#/');

	await expect(page.locator('body')).toContainText(
		'This is just a demo of TodoMVC for testing, not the real TodoMVC app.',
	);
});
