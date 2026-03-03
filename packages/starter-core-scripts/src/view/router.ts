/**
 * Result type returned by a route guard.
 *
 * - true → allow navigation
 * - false → block navigation
 * - string → redirect to provided path
 */
export type GuardResult = boolean | string | Promise<boolean | string>;

/**
 * Function signature for route guards.
 */
export type CanActivateFn = () => GuardResult;

/**
 * Interface representing a single route definition.
 */
export interface Route {
    /** URL path (e.g., '/', '/about'). */
    path: string;

    /** Component class to be instantiated when the route is matched. */
    component: any;

    /** Optional page title to be set in the browser tab. */
    title?: string;

    /**
     * Optional route guards executed before navigation.
     * All guards must resolve to true to allow navigation.
     * Returning false blocks navigation.
     * Returning string triggers redirect.
     */
    canActivate?: CanActivateFn[];
}

/**
 * SPA Router service for client-side navigation.
 *
 * Manages URL changes, updates the DOM, and handles component lifecycles.
 *
 * The Router is a DI-managed service and must be accessed via `inject(Router)`.
 * It supports async route guards (canActivate).
 */
export class Router {

    /** The root element where components will be rendered. */
    private root: HTMLElement | null;

    /** Reference to the currently active page instance. */
    private currentPage: any = null;

    /** Prevents multiple lifecycle initializations. */
    private initialized = false;

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
            this.render(window.location.pathname);
        });

        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('[data-link]');

            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href') || '/';
                this.navigate(href);
            }
        });

        this.render(window.location.pathname);
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
        await this.render(path);
    }

    /**
     * Executes canActivate guards sequentially.
     * Stops on first failure or redirect.
     *
     * @param guards - Array of guard functions.
     * @returns true if allowed, false if blocked, or redirect path string.
     */
    private async runGuards(guards: CanActivateFn[]): Promise<boolean | string> {
        for (const guard of guards) {
            const result = await guard();

            if (result === false) {
                return false;
            }

            if (typeof result === 'string') {
                return result;
            }
        }

        return true;
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

        if (!route) return;

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
            this.currentPage.mount();
        } else if (typeof this.currentPage.render === 'function') {
            this.currentPage.render();
        }
    }
}
