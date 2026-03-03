import {DIContainer, ProviderToken} from '../di/core';
import {Router, Route} from './router';
import ConsoleLogger from '../utils/console-logger';

/**
 * Interface defining a provider registration.
 */
export interface Provider {
    /** The class token to be used for injection. */
    provide: ProviderToken<any>;
    /** Optional: providing a ready-made instance. */
    useValue?: any;
    /** Optional: a factory function to create the instance. */
    useFactory?: () => any;
}

/**
 * Configuration object for the application startup.
 */
export interface AppConfig {
    /**
     * Array of route definitions for the Router.
     * Optional if routes are provided via provideRouter() in the providers array.
     */
    routes?: Route[];
    /** The ID of the HTML element where the app will render. Defaults to 'app-root'. */
    rootId?: string;
    /** Global services to be registered in the DI container before the app starts. */
    providers?: Provider[];
    /** Optional: Custom function to handle and render errors during bootstrap. */
    onError?: (error: Error) => void;
}

/**
 * Helper function to provide routing configuration in bootstrapApplication.
 * This aligns with the DI pattern and keeps app.ts clean.
 * @param routes - Array of route definitions.
 */
export function provideRouter(routes: Route[]): Provider {
    return {
        provide: Router,
        useValue: routes
    };
}

/**
 * Default error handler that renders a centered error modal with a backdrop.
 * Styled to match the dark-theme aesthetics of ConsoleLogger.
 */
function defaultErrorHandler(error: Error, rootId: string): void {
    const root = document.getElementById(rootId) || document.body;
    const overlay = document.createElement('div');

    Object.assign(overlay.style, {
        position: 'fixed', inset: '0', zIndex: '1000000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(4px)',
        padding: '20px', fontFamily: 'system-ui, sans-serif',
        animation: 'spa-in 0.1s ease-out'
    });

    overlay.innerHTML = `
        <div style="background: #0b1220; color: #e2e8f0; border: 1px solid #1e293b; border-radius: 12px; padding: 60px 30px; max-width: 700px; width: 100%; box-shadow: 0 20px 25px -5px #000;">
            <h2 style="margin: 0 0 15px; color: #f87171; font-size: 20px;">❌ Bootstrap Error</h2>
            <p style="margin: 0 0 15px; color: #94a3b8; font-size: 15px;">Application Error:</p>
            
            <pre style="background: #000; padding: 15px; border-radius: 6px; color: #fb7185; font-size: 15px; margin: 20px 0; border: 1px solid #1e293b; white-space: pre-wrap; word-break: break-all;">${error.message}</pre>
            
            <button onclick="location.reload()" style="width: 100%; background: #1e293b; color: #f1f5f9; border: 1px solid #334155; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: 600; margin-top: 8px;">
                Retry Loading
            </button>
        </div>
        <style>@keyframes spa-in {from {opacity: 0;} to {opacity: 1;}}</style>
    `;

    root.appendChild(overlay);
}

/**
 * Normalizes any caught value into a standard Error object.
 */
function normalizeError(err: any): Error {
    if (err instanceof Error) return err;
    if (typeof err === 'string') return new Error(err);
    return new Error(JSON.stringify(err) || 'Unknown bootstrap error');
}

/**
 * Internal helper to dispatch errors to the appropriate handler and logger.
 */
function handleBootstrapError(rawError: any, config: AppConfig, rootId: string): void {
    const error = normalizeError(rawError);
    const container = DIContainer.getInstance();
    let logger: ConsoleLogger;

    try {
        logger = container.resolve(ConsoleLogger as any);
    } catch {
        logger = new ConsoleLogger();
    }

    logger.error(`Critical Bootstrap Error: ${error.message}`);

    if (config.onError) {
        config.onError(error);
    } else {
        defaultErrorHandler(error, rootId);
    }
}

/**
 * Orchestrates the application setup: registers dependencies and starts the Router.
 * This is the central entry point for the SPA.
 * @param config - The application configuration object.
 */
export async function bootstrapApplication(config: AppConfig): Promise<void> {
    const container = DIContainer.getInstance();
    const rootId = config.rootId || 'app-root';

    return new Promise<void>(async (resolve, reject) => {
        try {
            // 1. Register global dependencies provided in the config
            if (config.providers) {
                for (const p of config.providers) {
                    // Skip manual Router registration if it's passed as routes in useValue
                    if (p.provide === Router && Array.isArray(p.useValue)) continue;

                    const instance = p.useValue ?? (p.useFactory ? await p.useFactory() : new (p.provide as any)());

                    if (instance === null || instance === undefined) {
                        throw new Error(`Provider for ${p.provide.name || 'unknown token'} returned ${instance}. Registration failed.`);
                    }

                    container.register(p.provide, instance);
                }
            }

            // 2. Encapsulate router initialization
            // Wait for DOM and then register Router in DI *before* calling .start()
            const startRouter = () => {
                try {
                    // Check if routes were provided via config or specialized provider
                    const routes = config.routes ||
                        config.providers?.find(p => p.provide === Router && Array.isArray(p.useValue))?.useValue;

                    if (!routes) {
                        throw new Error("Router configuration missing: Provide 'routes' in AppConfig.");
                    }

                    const router = new Router(routes, rootId);
                    // CRITICAL: Register in DI *before* starting.
                    // This ensures inject(Router) works during the first route render.
                    container.register(Router, router);
                    router.start();
                    resolve();
                } catch (routerError) {
                    handleBootstrapError(routerError, config, rootId);
                    reject(routerError);
                }
            };

            // 3. Ensure DOM is fully loaded to find the rootId element
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startRouter);
            } else {
                startRouter();
            }
        } catch (bootstrapError) {
            handleBootstrapError(bootstrapError, config, rootId);
            reject(bootstrapError);
        }
    });
}
