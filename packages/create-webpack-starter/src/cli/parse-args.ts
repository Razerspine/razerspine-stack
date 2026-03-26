import {Command} from 'commander';
import {CliOptions, ParsedCliInput} from './types';

const pkg = require('../../package.json');

/**
 * Parses CLI arguments using commander.
 */
export function parseCliArgs(): ParsedCliInput {
    const program = new Command();

    program
        .name('create-webpack-starter')
        .version(`create-webpack-starter v${pkg.version}`, '-v, --version', 'Show CLI version')
        .argument('[project-name]', 'Project name')
        .option('--style <style>', 'Style preprocessor (scss | less)')
        .option('--script <script>', 'Script language (js | ts)')
        .option('--app-type <type>', 'Application type (mpa | spa)')
        .option('--no-install', 'Skip npm install')
        .option('--dry-run', 'Do not write files');

    program.parse(process.argv);

    return {
        options: program.opts<CliOptions>(),
        projectName: program.args[0],
        rawArgs: program.args
    };
}
