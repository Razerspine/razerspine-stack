import {Command} from 'commander';

const pkg = require('../../package.json');

/**
 * Raw CLI options parsed from command line.
 */
export type CliOptions = {
    style?: 'scss' | 'less';
    script?: 'js' | 'ts';
    appType?: 'mpa' | 'spa';
    install?: boolean;
    dryRun?: boolean;
};

/**
 * Result of CLI parsing.
 */
export type ParsedCliInput = {
    options: CliOptions;
    projectName?: string;
    rawArgs: string[];
};

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
