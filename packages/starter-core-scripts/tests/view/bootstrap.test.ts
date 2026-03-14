import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {bootstrapApplication, provideRouter, DIContainer, Router} from '../../src';

vi.mock('../../src/router/router', () => {
    return {
        Router: vi.fn().mockImplementation(function () {
            return {
                start: vi.fn(),
            };
        }),
    };
});

vi.mock('../../src/utils/console-logger', () => {
    return {
        ConsoleLogger: vi.fn().mockImplementation(function () {
            return {
                error: vi.fn(),
            };
        }),
    };
});

describe('Bootstrap', () => {
    let container: DIContainer;

    beforeEach(() => {
        container = DIContainer.getInstance();
        container.clear();
        document.body.innerHTML = '<div id="app-root"></div>';

        Object.defineProperty(document, 'readyState', {
            get: () => 'complete',
            configurable: true
        });

        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('provideRouter()', () => {

        it('should return a valid provider object', () => {
            const routes = [{
                path: '/', component: class {
                } as any
            }];
            const provider = provideRouter(routes);
            expect(provider).toEqual({
                provide: Router,
                useValue: routes
            });
        });
    });

    describe('bootstrapApplication() Success', () => {

        it('should register providers and initialize the router', async () => {
            const routes = [{
                path: '/', component: class {
                } as any
            }];

            await bootstrapApplication({
                rootId: 'app-root',
                routes: routes
            });

            const registeredRouter = container.resolve(Router);
            expect(registeredRouter).toBeDefined();
            expect(Router).toHaveBeenCalledWith(routes, 'app-root');
        });
    });

    describe('Error Handling', () => {

        it('should throw error if routes are missing', async () => {
            expect.assertions(1);
            const config = {rootId: 'app-root'} as any;

            try {
                await bootstrapApplication(config);
            } catch (error: any) {
                expect(error.message).toMatch(/Router configuration missing/);
            }
        });

        it('should call custom onError if provided', async () => {
            expect.assertions(1);
            const onError = vi.fn();
            const config = {routes: null as any, onError};

            try {
                await bootstrapApplication(config);
            } catch (e) {
                expect(onError).toHaveBeenCalled();
            }
        });

        it('should render default error modal if no onError is provided', async () => {
            const config = {routes: null as any};

            try {
                await bootstrapApplication(config);
            } catch (e) {
                const bodyHtml = document.body.innerHTML;
                expect(bodyHtml).toContain('Bootstrap Error');
                expect(bodyHtml).toContain('Router configuration missing');
            }
        });

        it('should normalize non-Error throwable', async () => {
            expect.assertions(1);
            const config = {
                routes: [],
                providers: [{
                    provide: class Fail {
                    },
                    useFactory: async () => {
                        throw 'String error';
                    }
                }]
            } as any;

            try {
                await bootstrapApplication(config);
            } catch (error: any) {
                expect(error).toBe('String error');
            }
        });
    });
});
