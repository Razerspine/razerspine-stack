import {describe, it, expect, beforeEach, afterEach, vi, Mock} from 'vitest';
import {ApiService} from '../../src';
import {ApiError} from '../../src';

const createFetchResponse = (options: {
    ok?: boolean;
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    json?: any;
    text?: string;
}) => {
    return {
        ok: options.ok !== undefined ? options.ok : true,
        status: options.status || 200,
        statusText: options.statusText || 'OK',
        headers: new Headers(options.headers || {}),
        json: vi.fn().mockResolvedValue(options.json),
        text: vi.fn().mockResolvedValue(options.text),
        clone: function () {
            return this;
        },
    } as unknown as Response;
};

describe('ApiService', () => {

    let api: ApiService;
    let globalFetch: Mock;

    beforeEach(() => {
        globalFetch = vi.fn();
        global.fetch = globalFetch;
        api = new ApiService('https://api.example.com');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initialization & URLs', () => {

        it('removes trailing slash from baseUrl', async () => {
            const apiWithSlash = new ApiService('https://api.example.com/');
            globalFetch.mockResolvedValue(createFetchResponse({json: {}}));

            await apiWithSlash.get('users');

            expect(globalFetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.any(Object)
            );
        });

        it('adds leading slash to endpoint if missing', async () => {
            globalFetch.mockResolvedValue(createFetchResponse({json: {}}));

            await api.get('users');

            expect(globalFetch).toHaveBeenCalledWith(
                'https://api.example.com/users',
                expect.any(Object)
            );
        });
    });

    describe('HTTP Methods', () => {

        beforeEach(() => {
            globalFetch.mockResolvedValue(createFetchResponse({json: {success: true}}));
        });

        it('makes GET request', async () => {
            await api.get('/test');
            expect(globalFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({method: 'GET'}));
        });

        it('makes POST request with stringified body', async () => {
            const payload = {name: 'John'};
            await api.post('/test', payload);

            expect(globalFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(payload)
            }));
        });

        it('makes PUT request with stringified body', async () => {
            await api.put('/test', {id: 1});
            expect(globalFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({method: 'PUT'}));
        });

        it('makes PATCH request with stringified body', async () => {
            await api.patch('/test', {active: true});
            expect(globalFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({method: 'PATCH'}));
        });

        it('makes DELETE request', async () => {
            await api.delete('/test');
            expect(globalFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({method: 'DELETE'}));
        });
    });

    describe('Query Parameters', () => {

        it('appends query parameters correctly', async () => {
            globalFetch.mockResolvedValue(createFetchResponse({json: {}}));

            await api.get('/users', {
                params: {role: 'admin', age: 25, active: true, empty: null, undef: undefined}
            });

            expect(globalFetch).toHaveBeenCalledWith(
                'https://api.example.com/users?role=admin&age=25&active=true',
                expect.any(Object)
            );
        });
    });

    describe('Headers & Authentication', () => {

        beforeEach(() => {
            globalFetch.mockResolvedValue(createFetchResponse({json: {}}));
        });

        it('sets default headers', async () => {
            await api.get('/test');

            const fetchArgs = globalFetch.mock.calls[0][1];
            expect(fetchArgs.headers).toEqual({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            });
        });

        it('merges custom headers', async () => {
            await api.get('/test', {
                headers: {'X-Custom-Header': 'custom-value'}
            });

            const fetchArgs = globalFetch.mock.calls[0][1];
            expect(fetchArgs.headers).toHaveProperty('X-Custom-Header', 'custom-value');
        });

        it('adds Authorization header when token is set', async () => {
            api.setToken('test-token');
            await api.get('/test');

            const fetchArgs = globalFetch.mock.calls[0][1];
            expect(fetchArgs.headers).toHaveProperty('Authorization', 'Bearer test-token');
        });

        it('does not add Authorization header if skipAuth is true', async () => {
            api.setToken('test-token');
            await api.get('/test', {skipAuth: true});

            const fetchArgs = globalFetch.mock.calls[0][1];
            expect(fetchArgs.headers).not.toHaveProperty('Authorization');
        });

        it('removes token successfully', async () => {
            api.setToken('test-token');
            api.removeToken();
            await api.get('/test');

            const fetchArgs = globalFetch.mock.calls[0][1];
            expect(fetchArgs.headers).not.toHaveProperty('Authorization');
        });
    });

    describe('Response Handling', () => {

        it('returns parsed JSON on success', async () => {
            const mockData = {id: 1, name: 'Test'};
            globalFetch.mockResolvedValue(createFetchResponse({json: mockData}));

            const result = await api.get('/test');
            expect(result).toEqual(mockData);
        });

        it('returns empty object on 204 No Content status', async () => {
            globalFetch.mockResolvedValue(createFetchResponse({status: 204}));

            const result = await api.delete('/test');
            expect(result).toEqual({});
        });
    });

    describe('Error Handling & Timeouts', () => {

        it('throws ApiError on non-ok response with JSON data', async () => {
            expect.assertions(3);
            const errorData = {message: 'Validation failed'};
            globalFetch.mockResolvedValue(createFetchResponse({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                headers: {'Content-Length': '100'},
                json: errorData
            }));

            try {
                await api.get('/test');
            } catch (error: any) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.status).toBe(400);
                expect(error.data).toEqual(errorData);
            }
        });

        it('throws ApiError on non-ok response with text data fallback', async () => {
            expect.assertions(2);
            globalFetch.mockResolvedValue(createFetchResponse({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                headers: {'Content-Length': '100'},
                json: Promise.reject(new Error('Not JSON')),
                text: 'Plain text error'
            }));

            try {
                await api.get('/test');
            } catch (error: any) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.data).toBe('Plain text error');
            }
        });

        it('handles AbortError and throws custom timeout error', async () => {
            expect.assertions(1);
            const abortError = new Error('Aborted');
            abortError.name = 'AbortError';
            globalFetch.mockRejectedValue(abortError);

            try {
                await api.get('/test', {timeout: 1000});
            } catch (error: any) {
                expect(error.message).toBe('Request timeout: exceeding 1000ms');
            }
        });

        it('rethrows other unknown errors', async () => {
            expect.assertions(1);
            const networkError = new Error('Network Error');
            globalFetch.mockRejectedValue(networkError);

            try {
                await api.get('/test');
            } catch (error: any) {
                expect(error.message).toBe('Network Error');
            }
        });
    });
});
