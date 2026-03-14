import {CanActivateFn, Route} from './router.types';

/**
 * SPA Router service for client-side navigation.
 *
 * Manages URL changes, updates the DOM, and handles component lifecycles.
 *
 * The Router is a DI-managed service and must be accessed via `inject(Router)`.
 * It supports async route guards (canActivate).
 *
 * Runtime errors during navigation are handled internally
 * and do NOT propagate to bootstrapApplication.
 */
export class Router {

    /** The root element where components will be rendered. */
    private root: HTMLElement | null;

    /** Reference to the currently active page instance. */
    private currentPage: any = null;

    /** Prevents multiple lifecycle initializations. */
    private initialized = false;

    /**
     * Optional global navigation error handler.
     * Can be set externally if custom runtime error UI is needed.
     */
    public onNavigationError?: (error: Error) => void;

    /**
     * @param routes - Array of route definitions.
     * @param rootId - ID of the HTML element acting as the app container. Defaults to 'app-root'.
     */
    constructor(private routes: Route[], rootId: string = 'app-root') {
        this.root = document.getElementById(rootId);

        if (!this.root) {
            console.warn(`Router: Element with id "${rootId}" not found. Navigation will not render.`);
        }
    }

    /**
     * Starts router lifecycle:
     * - attaches navigation listeners
     * - performs initial render
     *
     * Safe to call only once.
     * Subsequent calls are ignored.
     */
    public start(): void {
        if (this.initialized) return;

        this.initialized = true;

        window.addEventListener('popstate', () => {
            this.safeRender(window.location.pathname).then();
        });

        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('[data-link]');

            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href') || '/';
                this.navigate(href).then();
            }
        });

        this.safeRender(window.location.pathname).then();
    }

    /**
     * Navigates to a specific path and updates the browser history.
     *
     * Supports async guards.
     *
     * @param path - The destination URL path.
     */
    public async navigate(path: string): Promise<void> {
        window.history.pushState(null, '', path);
        await this.safeRender(path);
    }

    /**
     * Executes canActivate guards sequentially.
     * Stops on first failure or redirect.
     *
     * Errors thrown inside guards are caught and handled internally.
     *
     * @param guards - Array of guard functions.
     * @returns true if allowed, false if blocked, or redirect path string.
     */
    private async runGuards(guards: CanActivateFn[]): Promise<boolean | string> {
        for (const guard of guards) {
            try {
                const result = await guard();

                if (result === false) {
                    return false;
                }

                if (typeof result === 'string') {
                    return result;
                }

            } catch (error) {
                this.handleNavigationError(error);
                return false;
            }
        }

        return true;
    }

    /**
     * Safe wrapper around render().
     * Ensures runtime navigation errors never escape the Router.
     *
     * @param path - The path to render.
     */
    private async safeRender(path: string): Promise<void> {
        try {
            await this.render(path);
        } catch (error) {
            this.handleNavigationError(error);
        }
    }

    /**
     * Centralized runtime navigation error handler.
     *
     * - Normalizes error
     * - Logs to console
     * - Triggers optional global handler
     */
    private handleNavigationError(rawError: any): void {
        const error =
            rawError instanceof Error
                ? rawError
                : new Error(typeof rawError === 'string'
                    ? rawError
                    : JSON.stringify(rawError) || 'Unknown navigation error');

        console.error(`Router Navigation Error: ${error.message}`);

        if (this.onNavigationError) {
            this.onNavigationError(error);
        }
    }

    /**
     * Orchestrates the transition between pages.
     * Handles guard evaluation, cleanup of the old page,
     * and initialization of the new one.
     *
     * @param path - The path to render.
     * @private
     */
    private async render(path: string): Promise<void> {
        if (!this.root) return;

        const route =
            this.routes.find(r => r.path === path) ||
            this.routes.find(r => r.path === '/404') ||
            this.routes[0];

        if (!route) {
            throw new Error(`Route not found: ${path}`);
        }

        // 🔐 1. Run canActivate guards if present
        if (route.canActivate && route.canActivate.length > 0) {
            const guardResult = await this.runGuards(route.canActivate);

            if (guardResult === false) {
                return; // Block navigation silently
            }

            if (typeof guardResult === 'string') {
                await this.navigate(guardResult); // Redirect
                return;
            }
        }

        // 2. Cleanup previous page
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
            this.currentPage.destroy();
        }

        // 3. Update browser metadata
        if (route.title) {
            document.title = route.title;
        }

        // 4. Render new component
        this.root.innerHTML = '';
        this.currentPage = new route.component(this.root);

        // 5. Lifecycle execution
        if (typeof this.currentPage.mount === 'function') {
            await this.currentPage.mount();
        } else if (typeof this.currentPage.render === 'function') {
            await this.currentPage.render();
        }
    }
}
