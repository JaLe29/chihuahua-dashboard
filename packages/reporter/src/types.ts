export interface ApiConfig {
	apiUrl: string;
	apiToken: string;
}

export interface ReporterConfig {
	api: ApiConfig;
}

export interface ChihuahuaReporterOptions extends ReporterConfig {
	runId: string;
}
