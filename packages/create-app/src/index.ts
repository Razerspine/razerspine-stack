import {getCliContext} from './cli';
import {createApp} from './core/create-app';
import {log} from './utils';

/**
 * Global handler for unhandled promise rejections.
 * Specifically catches intentional user cancellations (e.g., exiting prompts).
 * Logs unexpected errors to prevent silent failures.
 *
 * @param err - The unhandled error object
 */
process.on('unhandledRejection', (err: unknown) => {
    const error = err as { isTtyError?: boolean; name?: string; message?: string };

    // Handle user cancellation gracefully
    if (error?.isTtyError || error?.name === 'ExitPromptError') {
        log.info('Cancelled by user');
        process.exit(130); // 130 is the standard exit code for script termination via Ctrl+C
    } else {
        // Fallback for unexpected unhandled rejections
        log.error(`❌ Unhandled Rejection: ${error?.message || err}`);
        process.exit(1);
    }
});

/**
 * Main CLI application entry point.
 * Initializes context and triggers the application scaffolding process.
 * * @returns Promise resolving when execution finishes
 */
async function run(): Promise<void> {
    try {
        const cli = await getCliContext();

        await createApp({
            projectName: cli.projectName,
            templateKey: cli.template,
            appType: cli.appType,
            noInstall: cli.noInstall,
            dryRun: cli.dryRun,
            pm: cli.pm,
        });
    } catch (err: unknown) {
        const error = err as { message?: string };
        // Use custom logger instead of native console.error for consistency
        log.error(`❌ Error: ${error?.message || err}`);
        process.exit(1);
    }
}

// Execute the main function and ensure any catastrophic top-level errors are caught
run().catch((err: unknown) => {
    log.error(`❌ Fatal Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
});
