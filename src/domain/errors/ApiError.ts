export class ApiError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly responseBody: string,
    ) {
        super(`API request failed with status ${statusCode}: ${responseBody}`);
        this.name = 'ApiError';
    }
}
