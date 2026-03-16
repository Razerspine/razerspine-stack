/**
 * Internal helpers for the bootstrap.
 * Not part of the public API.
 * @internal
 */

import {AppConfig} from './bootstrap.types';
import {DIContainer} from '../core';
import {ConsoleLogger} from '../utils';
import {Route, Router} from "../router";

/**
 * Default error handler that renders a centered error modal with a backdrop.
 * Styled to match the dark-theme aesthetics of ConsoleLogger.
 */
export function defaultErrorHandler(
    error: Error,
    rootId: string
): void {
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
export function normalizeError(err: any): Error {
    if (err instanceof Error) return err;
    if (typeof err === 'string') return new Error(err);

    return new Error(JSON.stringify(err) || 'Unknown bootstrap error');
}

/**
 * Internal helper to dispatch errors to the appropriate handler and logger.
 */
export function handleBootstrapError(
    rawError: any,
    config: AppConfig,
    rootId: string
): void {
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
 * Waits until DOM is ready.
 * Used by bootstrap to safely access root elements.
 */
export function waitForDOM(): Promise<void> {
    if (document.readyState === 'loading') {
        return new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', () => resolve(), {once: true});
        });
    }

    return Promise.resolve();
}

/**
 * Resolves route configuration from AppConfig.
 *
 * Routes can be provided either:
 * - directly via config.routes
 * - via provideRouter() helper in providers
 */
export function resolveRoutes(config: AppConfig): Route[] | undefined {
    if (config.routes) return config.routes;

    return config.providers?.find(p => p.provide === Router && Array.isArray(p.useValue))?.useValue;
}


/**
 * Starts the application router.
 *
 * Extracted from bootstrapApplication to allow easier testing
 * without relying on DOM lifecycle.
 *
 * @internal
 */
export function startRouter(
    routes: Route[],
    rootId: string,
    container: DIContainer
): Router {
    const rootElement = document.getElementById(rootId);

    if (!rootElement) {
        throw new Error(`Root element with id "${rootId}" not found. Ensure it exists in your HTML.`);
    }

    const router = new Router(routes, rootId);
    container.register(Router, router);
    router.start();

    return router;
}
