import kleur from 'kleur';

/**
 * Standardized console logger utility with colorized output.
 */
export const log = {
    /** Logs an informational message in cyan color. */
    info: (msg: string) => console.log(kleur.cyan(msg)),

    /** Logs a success message in green color. */
    success: (msg: string) => console.log(kleur.green(msg)),

    /** Logs an error message in red color to stderr. */
    error: (msg: string) => console.error(kleur.red(msg))
};
