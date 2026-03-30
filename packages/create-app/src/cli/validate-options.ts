/**
 * Validates CLI flags and throws on invalid combinations.
 */
export function validateOptions(options: {
    style?: string;
    script?: string;
    appType?: string;
    pm?: string;
}) {
    const hasStyle = Boolean(options.style);
    const hasScript = Boolean(options.script);
    const hasAppType = Boolean(options.appType);

    const flagsCount = [hasStyle, hasScript, hasAppType].filter(Boolean).length;

    if (flagsCount > 0 && flagsCount < 3) {
        throw new Error(
            'You must provide --app-type, --style and --script together, or use interactive mode'
        );
    }

    if (options.appType && !['mpa', 'spa'].includes(options.appType)) {
        throw new Error('Invalid --app-type. Expected "mpa" or "spa"');
    }

    if (options.style && !['scss', 'less'].includes(options.style)) {
        throw new Error('Invalid --style. Expected "scss" or "less"');
    }

    if (options.script && !['js', 'ts'].includes(options.script)) {
        throw new Error('Invalid --script. Expected "js" or "ts"');
    }

    if (options.pm && !['npm', 'yarn', 'pnpm', 'bun'].includes(options.pm)) {
        throw new Error('Invalid --pm. Expected "npm", "yarn", "pnpm" or "bun"');
    }
}
