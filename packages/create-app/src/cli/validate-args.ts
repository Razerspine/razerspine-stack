/**
 * Prevents accidental project creation using reserved words.
 * Handled gracefully to redirect users who forget the '--' prefix.
 * * @param {string[]} rawArgs - The raw positional arguments passed to the CLI.
 */
export function validateRawArgs(rawArgs: string[]) {
    if (rawArgs.length !== 1) return;

    const arg = rawArgs[0].toLowerCase();

    const isVersion = ['version', 'v'].includes(arg);
    const isHelp = ['help', 'h'].includes(arg);

    if (isVersion || isHelp) {
        const type = isVersion ? 'version' : 'help';
        const flag = isVersion ? '-v' : '-h';
        const action = isVersion ? 'check the version' : 'ask for help';

        console.error(`⚠️ Error: '${rawArgs[0]}' is not a valid project name.`);
        console.error(`Did you mean to ${action}? Use one of these:`);
        console.error(` create --${type}`);
        console.error(` create ${flag}`);
        process.exit(1);
    }
}
