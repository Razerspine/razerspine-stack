import {DIContainer} from '../core';
import {Router, Route} from '../router';
import {AppConfig, Provider} from './bootstrap.types';
import {handleBootstrapError, resolveRoutes, waitForDOM} from './bootstrap.utils';

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
 * Orchestrates the application setup: registers dependencies and starts the Router.
 * This is the central entry point for the SPA.
 * @param config - The application configuration object.
 */
export async function bootstrapApplication(config: AppConfig): Promise<void> {
    const container = DIContainer.getInstance();
    const rootId = config.rootId || 'app-root';

    try {
        /**
         * 1. Register global dependencies provided in the config
         */
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

        /**
         * 2. Resolve routes configuration
         */
        const routes = resolveRoutes(config);

        if (!routes) {
            throw new Error("Router configuration missing: Provide 'routes' in AppConfig.");
        }

        /**
         * 3. Wait until DOM is ready
         */
        await waitForDOM();

        /**
         * 4. Validate root element before router start
         */
        const rootElement = document.getElementById(rootId);

        if (!rootElement) {
            throw new Error(`Root element with id "${rootId}" not found. Ensure it exists in your HTML.`);
        }

        /**
         * 5. Initialize router
         */
        const router = new Router(routes, rootId);
        // CRITICAL: Register in DI *before* starting.
        // This ensures inject(Router) works during the first route render.
        container.register(Router, router);
        router.start();
    } catch (bootstrapError) {
        handleBootstrapError(bootstrapError, config, rootId);
        throw bootstrapError;
    }
}
