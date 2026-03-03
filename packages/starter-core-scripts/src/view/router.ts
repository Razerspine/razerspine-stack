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
}

/**
 * SPA Router service for client-side navigation.
 * Manages URL changes, updates the DOM, and handles component lifecycles.
 * Implements Singleton pattern for global access to navigation.
 */
export class Router {
    /** Global instance for static access. */
    private static instance: Router | null = null;

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

        // Store the instance for static navigate() calls
        Router.instance = this;
    }

    /**
     * Static helper to navigate from anywhere in the application.
     * Use this in components: Router.navigate('/about');
     * @param path - The destination URL path.
     */
    public static navigate(path: string): void {
        if (Router.instance) {
            Router.instance.navigate(path);
        } else {
            console.error('Router instance not found. Ensure "new Router()" is called in your entry point.');
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

        // Listen for browser Back/Forward navigation
        window.addEventListener('popstate', () => this.render(window.location.pathname));

        // Global click listener for declarative navigation via [data-link]
        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('[data-link]');

            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href') || '/';
                this.navigate(href);
            }
        });

        // Initial render based on the current URL
        this.render(window.location.pathname);
    }

    /**
     * Navigates to a specific path and updates the browser history.
     * @param path - The destination URL path.
     */
    public navigate(path: string): void {
        window.history.pushState(null, '', path);
        this.render(path);
    }

    /**
     * Orchestrates the transition between pages.
     * Handles cleanup of the old page and initialization of the new one.
     * @param path - The path to render.
     * @private
     */
    private render(path: string): void {
        if (!this.root) return;

        // 1. Trigger lifecycle cleanup on the current page to prevent memory leaks
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
            this.currentPage.destroy();
        }

        // 2. Find matching route or fallback to 404/Home
        const route = this.routes.find(r => r.path === path) ||
            this.routes.find(r => r.path === '/404') ||
            this.routes[0];

        // 3. Update browser metadata
        if (route.title) {
            document.title = route.title;
        }

        // 4. Clear container and prepare the new component
        this.root.innerHTML = '';
        this.currentPage = new route.component(this.root);

        // 5. Intelligent Bootstrapping:
        // Prioritize mount() (full lifecycle) over render() (simple injection)
        if (typeof this.currentPage.mount === 'function') {
            this.currentPage.mount();
        } else if (typeof this.currentPage.render === 'function') {
            this.currentPage.render();
        }
    }
}
