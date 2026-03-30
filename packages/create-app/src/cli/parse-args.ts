import {Command} from 'commander';
import {CliOptions, ParsedCliInput} from './types';
import {VERSION} from '../utils';

/**
 * Parses CLI arguments using commander.
 */
export function parseCliArgs(): ParsedCliInput {
    const program = new Command();

    program
        .name('create-app')
        .version(`create-app v${VERSION}`, '-v, --version', 'Show CLI version')
        .argument('[project-name]', 'Project name')
        .option('--style <style>', 'Style preprocessor (scss | less)')
        .option('--script <script>', 'Script language (js | ts)')
        .option('--app-type <type>', 'Application type (mpa | spa)')
        .option('--pm <pm>', 'Package manager (npm | yarn | pnpm | bun)', 'npm')
        .option('--no-install', 'Skip npm install')
        .option('--dry-run', 'Do not write files');

    program.parse(process.argv);

    return {
        options: program.opts<CliOptions>(),
        projectName: program.args[0],
        rawArgs: program.args
    };
}
