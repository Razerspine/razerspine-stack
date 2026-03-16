/**
 * Configuration options for API requests.
 * Extends standard RequestInit with additional utility fields.
 */
export type RequestConfig = RequestInit & {
    /** Query parameters to be appended to the URL */
    params?: Record<string, string | number | boolean>;
    /** Request timeout in milliseconds. Defaults to 10000 (10s) */
    timeout?: number;
    /** If true, the Authorization header will not be added to the request */
    skipAuth?: boolean;
};
