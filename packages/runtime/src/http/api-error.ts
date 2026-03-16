/**
 * Custom error class for API-related failures.
 * Provides access to HTTP status and server response data.
 */
export class ApiError extends Error {
    public status: number;
    public data: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}
