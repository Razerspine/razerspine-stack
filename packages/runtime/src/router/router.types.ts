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
