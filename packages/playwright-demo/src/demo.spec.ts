import test, { expect } from '@playwright/test';

test('demo 1', async ({ page }) => {
	await page.goto('https://demo.playwright.dev/todomvc/#/');
	console.log('page', page.url());
	await expect(page.locator('body')).toContainText(
		'This is just a demo of TodoMVC for testing, not the real TodoMVC app.',
	);
});
