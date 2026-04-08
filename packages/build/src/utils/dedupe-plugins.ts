import {WebpackPluginInstance} from 'webpack';

/**
 * @module dedupe-plugins
 * @description Deduplication utility for Webpack plugin instances.
 *
 * ## Strategy
 *
 * Uses a **hybrid deduplication** approach combining Symbol-based tagging for
 * internal framework plugins and `constructor.name`-based fallback deduplication
 * for user-supplied plugins that collide with a tagged internal instance.
 *
 * ### Why not `constructor.name` alone?
 *
 * Keying solely on `constructor.name` causes false positives: many standard
 * Webpack plugins (`DefinePlugin`, `ProvidePlugin`, `CopyWebpackPlugin`, etc.)
 * are legitimately used more than once with different arguments. Removing all
 * duplicates by class name would silently break these setups.
 *
 * ### Why not Symbol alone?
 *
 * A purely Symbol-based approach cannot detect when a user manually adds an
 * instance of the same plugin class that the framework registers internally
 * (e.g. via `plugins.extend: [new PugPlugin()]` alongside the internal
 * `PugPlugin`). Since user-supplied instances are untagged, they would always
 * pass through alongside the tagged internal one — resulting in two instances.
 *
 * ### Hybrid approach
 *
 * 1. **Tagged plugins** (marked via {@link markPlugin}): deduplicated precisely
 *    by Symbol. Only the first occurrence of each unique Symbol is kept.
 *    Two separately marked instances always have different Symbols, so both are kept.
 *
 * 2. **Untagged plugins** (user-supplied / third-party): kept as-is **unless**
 *    a tagged instance of the same class (`constructor.name`) is already present
 *    in the array. In that case the untagged copy is removed to prevent
 *    double-registration of the same plugin class.
 *
 * This means:
 * - Internal framework plugins (`PugPlugin`, `HtmlWebpackPlugin`,
 *   `MiniCssExtractPlugin`, `HostingRoutingPlugin`) are deduplicated precisely.
 * - Purely user-supplied plugins (`DefinePlugin`, `ProvidePlugin`, etc.) are
 *   **never removed** unless they collide with an internal tagged instance of
 *   the same class.
 *
 * ### Two-pass algorithm
 *
 * **Pass 1** — collect the `constructor.name` of every tagged instance.
 * **Pass 2** — filter: keep tagged instances (deduplicated by Symbol),
 *              keep untagged instances only when their class is NOT in the
 *              tagged-names set collected in pass 1.
 *
 * @example
 * ```ts
 * // Mark an internal plugin instance before pushing it into config.plugins:
 * const instance = markPlugin(new HtmlWebpackPlugin({ filename: 'index.html' }));
 * config.plugins.push(instance);
 *
 * // Later, dedupePlugins removes exact Symbol duplicates AND untagged instances
 * // of classes that are already covered by a tagged instance:
 * config.plugins = dedupePlugins(config.plugins);
 * ```
 */

/**
 * Internal WeakMap that associates a plugin instance with its deduplication Symbol.
 *
 * Using a WeakMap ensures there is no memory leak — when a plugin instance is
 * garbage-collected the entry is removed automatically.
 */
const pluginSymbols = new WeakMap<WebpackPluginInstance, symbol>();

/**
 * Tags a plugin instance with a unique deduplication Symbol and returns it.
 *
 * Call this function once per internal plugin instance, immediately after
 * construction and before it is pushed into `config.plugins`. The returned
 * value is the same object — the tag is stored in a side-channel WeakMap and
 * does not mutate the plugin itself.
 *
 * @template T - The concrete plugin type (preserves the original type).
 * @param {T} plugin - The Webpack plugin instance to tag.
 * @returns {T} The same plugin instance (tagged internally).
 *
 * @example
 * ```ts
 * const pugPlugin = markPlugin(new PugPlugin({ entry, filename, js, css }));
 * config.plugins.push(pugPlugin);
 * ```
 */
export function markPlugin<T extends WebpackPluginInstance>(plugin: T): T {
    pluginSymbols.set(plugin, Symbol());
    return plugin;
}

/**
 * Removes duplicate plugin instances from the provided array using a hybrid strategy.
 *
 * **Pass 1** — scan the array and collect the `constructor.name` of every tagged instance.
 *
 * **Pass 2** — filter the array:
 * - Tagged plugins: keep only the **first** occurrence of each unique Symbol.
 * - Untagged plugins: keep if their `constructor.name` is NOT in the tagged-names
 *   set (i.e. no internal instance of that class exists). If a tagged instance of
 *   the same class is already present, the untagged copy is removed to prevent
 *   double-registration.
 *
 * The first-wins semantics ensure a predictable, stable output order.
 *
 * @param {WebpackPluginInstance[]} plugins - The flat plugin array to deduplicate.
 * @returns {WebpackPluginInstance[]} A new array with duplicates removed.
 */
export function dedupePlugins(plugins: WebpackPluginInstance[]): WebpackPluginInstance[] {
    /**
     * Pass 1: collect constructor names of all tagged (internal) instances.
     *
     * These are the class names for which an authoritative internal instance
     * already exists. Any untagged instance of the same class is a duplicate
     * added by the user (e.g. via `plugins.extend`) and should be removed.
     */
    const taggedClassNames = new Set<string>();

    for (const plugin of plugins) {
        if (pluginSymbols.has(plugin)) {
            const name = plugin?.constructor?.name;
            if (name) {
                taggedClassNames.add(name);
            }
        }
    }

    /**
     * Pass 2: filter the array.
     *
     * - Tagged instance  → keep if its Symbol has not been seen yet (first-wins).
     * - Untagged instance → keep only when no tagged instance of the same class exists.
     */
    const seenSymbols = new Set<symbol>();

    return plugins.filter((plugin) => {
        const sym = pluginSymbols.get(plugin);

        if (sym !== undefined) {
            // Tagged plugin — keep only the first occurrence
            if (seenSymbols.has(sym)) {
                return false;
            }
            seenSymbols.add(sym);
            return true;
        }

        // Untagged plugin — remove if a tagged instance of the same class exists
        const name = plugin?.constructor?.name;
        if (name && taggedClassNames.has(name)) {
            return false;
        }

        return true;
    });
}
