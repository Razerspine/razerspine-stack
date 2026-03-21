import {WebpackPluginInstance} from 'webpack';

/**
 * Prevent duplicate plugins (by constructor name)
 */
export function dedupePlugins(plugins: WebpackPluginInstance[]): WebpackPluginInstance[] {
    const seen = new Set<string>();

    return plugins.filter((plugin) => {
        const name = plugin?.constructor?.name;

        if (!name) return true;

        if (seen.has(name)) {
            return false;
        }

        seen.add(name);
        return true;
    });
}
