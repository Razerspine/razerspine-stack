import {WebpackPluginInstance} from 'webpack';

/**
 * Prevent duplicate plugins (by constructor name and target filename)
 */
export function dedupePlugins(plugins: WebpackPluginInstance[]): WebpackPluginInstance[] {
    const seen = new Set<string>();

    return plugins.filter((plugin) => {
        const name = plugin?.constructor?.name;

        if (!name) return true;

        let key = name;

        // Support instances that output to different files (e.g., HtmlWebpackPlugin in MPA)
        const options = (plugin as any).userOptions || (plugin as any).options;
        if (options && options.filename) {
            key = `${name}:${options.filename}`;
        }

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}
