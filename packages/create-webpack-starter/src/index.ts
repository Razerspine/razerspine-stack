import {getCliContext} from './cli';
import {createApp} from './core/create-app';
import {log} from './utils';

process.on('unhandledRejection', (err: unknown) => {
    const error = err as { isTtyError?: boolean; name?: string };
    if (error?.isTtyError || error?.name === 'ExitPromptError') {
        log.info('Cancelled by user');
        process.exit(130);
    }
});

async function run() {
    try {
        const cli = await getCliContext();

        await createApp({
            projectName: cli.projectName,
            templateKey: cli.template,
            appType: cli.appType,
            noInstall: cli.noInstall,
            dryRun: cli.dryRun
        });
    } catch (err: unknown) {
        const error = err as { message?: string };
        console.error('❌ Error:', error?.message || err);
        process.exit(1);
    }
}

run().then();
