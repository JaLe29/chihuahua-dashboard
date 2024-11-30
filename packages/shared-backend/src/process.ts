/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
type ShutdownCallback = () => Promise<void>;

export const registerShutdown = (callbacks: ShutdownCallback[]) => {
	process.on('SIGTERM', async () => {
		for (const cb of callbacks) {
			await cb();
		}

		process.exit(0);
	});

	process.on('SIGINT', async () => {
		for (const cb of callbacks) {
			await cb();
		}

		process.exit(0);
	});
};
