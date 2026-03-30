/**
 * Prevents accidental project creation using reserved words.
 */
export function validateRawArgs(rawArgs: string[]) {
    if (rawArgs.length !== 1) return;

    const arg = rawArgs[0].toLowerCase();

    if (['version', 'v'].includes(arg)) {
        console.error(`⚠️ Error: '${rawArgs[0]}' is not a valid project name.`);
        console.error('Did you mean to check the version? Use one of these:');
        console.error(' create --version');
        console.error(' create -v');
        process.exit(1);
    }

    if (['help', 'h'].includes(arg)) {
        console.error(`⚠️  Error: '${rawArgs[0]}' is not a valid project name.`);
        console.error('Did you mean to ask for help? Use one of these:');
        console.error(' create --help');
        console.error(' create -h');
        process.exit(1);
    }
}
