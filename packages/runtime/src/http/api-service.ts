import {ApiError} from './api-error';
import {RequestConfig} from './api.types';

/**
 * Service for handling HTTP requests using the Fetch API.
 * Provides a wrapper for common methods and centralized error handling.
 * * @example
 * ```typescript
 * const api = new ApiService('[https://api.example.com](https://api.example.com)');
 * api.setToken('your-jwt-token');
 * * // GET with query params and timeout
 * try {
 * const users = await api.get('/users', {
 * params: { role: 'admin' },
 * timeout: 5000
 * });
 * } catch (err) {
 * if (err instanceof ApiError) console.error(err.status, err.data);
 * }
 * * // POST request
 * const newUser = await api.post('/users', { name: 'John Doe' });
 * ```
 */
export class ApiService {
    private baseUrl: string;
    private accessToken: string | null = null;

    /**
     * @param baseUrl - root URL for the API (e.g., 'https://api.example.com')
     */
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    }

    /**
     * Set the Auth token (Bearer) for future requests
     */
    public setToken(token: string): void {
        this.accessToken = token;
    }

    /**
     * Remove the Auth token
     */
    public removeToken(): void {
        this.accessToken = null;
    }

    /**
     * GET request
     */
    public get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this._request<T>(endpoint, {...config, method: 'GET'});
    }

    /**
     * POST request
     */
    public post<T>(
        endpoint: string,
        body: any,
        config?: RequestConfig
    ): Promise<T> {
        return this._request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    /**
     * PUT request
     */
    public put<T>(
        endpoint: string,
        body: any,
        config?: RequestConfig
    ): Promise<T> {
        return this._request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    /**
     * PATCH request
     */
    public patch<T>(
        endpoint: string,
        body: any,
        config?: RequestConfig
    ): Promise<T> {
        return this._request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    /**
     * DELETE request
     */
    public delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this._request<T>(endpoint, {...config, method: 'DELETE'});
    }

    /**
     * Core request handler
     */
    private async _request<T>(
        endpoint: string,
        config: RequestConfig
    ): Promise<T> {
        const {
            params,
            timeout = 10000,
            skipAuth = false,
            headers: customHeaders,
            ...fetchOptions
        } = config;

        // 1. Build URL
        let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const qs = searchParams.toString();
            if (qs) url += `?${qs}`;
        }

        // 2. Setup Headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...customHeaders
        };

        if (this.accessToken && !skipAuth) {
            (headers as Record<string, string>)['Authorization'] =
                `Bearer ${this.accessToken}`;
        }

        // 3. Setup Timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorData = null;
                const contentLength = response.headers.get('Content-Length');
                const hasContent = contentLength && contentLength !== '0';

                if (hasContent) {
                    const errorResponse = response.clone();
                    try {
                        errorData = await errorResponse.json();
                    } catch {
                        errorData = await response.text();
                    }
                }

                throw new ApiError(
                    response.status,
                    response.statusText || `Request failed with status ${response.status}`,
                    errorData,
                );
            }

            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout: exceeding ${timeout}ms`);
            }
            throw error;
        }
    }
}
