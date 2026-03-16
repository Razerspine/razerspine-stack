import {DIContainer} from '../core';
import {Router, Route} from '../router';
import {AppConfig, Provider} from './bootstrap.types';
import {handleBootstrapError, resolveRoutes, waitForDOM, startRouter} from './bootstrap.utils';

/**
 * Helper function to provide routing configuration in bootstrapApplication.
 * This aligns with the DI pattern and keeps app.ts clean.
 *
 * This helper allows passing routes via the providers array instead of the
 * `routes` property in AppConfig.
 *
 * Both approaches are supported:
 *
 * bootstrapApplication({ routes })
 *
 * OR
 *
 * bootstrapApplication({
 *   providers: [provideRouter(routes)]
 * })
 *
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
 *
 * Responsibilities:
 * 1. Register dependency providers
 * 2. Resolve router configuration
 * 3. Wait for DOM readiness
 * 4. Initialize and start the Router
 *
 * The router startup logic is delegated to `startRouter()` to keep this
 * function easier to test and maintain.
 *
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
                /**
                 * Skip Router provider if it's actually the route configuration
                 * coming from provideRouter(routes).
                 *
                 * Router instance is created later in startRouter().
                 */
                if (p.provide === Router && Array.isArray(p.useValue)) {
                    continue;
                }

                let instance;

                /**
                 * Resolve provider instance
                 */
                if (p.useValue !== undefined) {
                    instance = p.useValue;
                } else if (p.useFactory) {
                    instance = await p.useFactory();
                } else {
                    instance = new (p.provide as any)();
                }

                if (instance === null || instance === undefined) {
                    throw new Error(`Provider for ${p.provide.name || 'unknown token'} returned ${instance}. Registration failed.`);
                }

                container.register(p.provide, instance);
            }
        }

        /**
         * 2. Resolve routes configuration
         *
         * Routes may come from:
         * - config.routes
         * - provideRouter(routes)
         */
        const routes = resolveRoutes(config);

        if (!routes) {
            throw new Error("Router configuration missing: Provide 'routes' in AppConfig.");
        }

        /**
         * 3. Wait until DOM is ready
         *
         * Ensures the root element exists before router initialization.
         */
        await waitForDOM();

        /**
         * 4. Initialize router
         *
         * Router creation and startup are delegated to startRouter()
         * to make the bootstrap process easier to test in isolation.
         */
        startRouter(routes, rootId, container);

    } catch (bootstrapError) {
        handleBootstrapError(bootstrapError, config, rootId);
        throw bootstrapError;
    }
}
