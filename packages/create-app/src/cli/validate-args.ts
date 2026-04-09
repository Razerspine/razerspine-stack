/**
 * Prevents accidental project creation using reserved words.
 * Handled gracefully to redirect users who forget the '--' prefix.
 * Checks every positional argument regardless of total count.
 *
 * @param {string[]} rawArgs - The raw positional arguments passed to the CLI.
 */
export function validateRawArgs(rawArgs: string[]) {
    for (const arg of rawArgs) {
        const normalized = arg.toLowerCase();

        const isVersion = ['version', 'v'].includes(normalized);
        const isHelp = ['help', 'h'].includes(normalized);

        if (isVersion || isHelp) {
            const type = isVersion ? 'version' : 'help';
            const flag = isVersion ? '-v' : '-h';
            const action = isVersion ? 'check the version' : 'ask for help';

            console.error(`⚠️ Error: '${arg}' is not a valid project name.`);
            console.error(`Did you mean to ${action}? Use one of these:`);
            console.error(` create --${type}`);
            console.error(` create ${flag}`);
            process.exit(1);
        }
    }
}
