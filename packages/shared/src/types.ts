export interface ProjectConfig {
	/**
	 * Maximum timeout for a test run in minutes
	 */
	maxTimeout: number;

	/**
	 * Retention period for test results in days
	 */
	retention: number;

	/**
	 * Date format for all dates in the project
	 */
	dateFormat: string;
}
