import type { PayloadUpload } from '@chihuahua-dashboard/shared-api';

export class UploadService {
	async upload(file: PayloadUpload) {
		console.log(file);
	}
}
