import {Command} from 'commander';
import inquirer from 'inquirer';
import {templates, TemplateKey} from './templates';
import {resolveTemplateKey} from './template-resolver';

const pkg = require('../package.json');

type CliOptions = {
    style?: 'scss' | 'less';
    script?: 'js' | 'ts';
    appType?: 'mpa' | 'spa';
    install?: boolean;
    dryRun?: boolean;
};

export async function getCliContext(): Promise<{
    projectName: string;
    template: TemplateKey;
    appType: 'mpa' | 'spa';
    noInstall: boolean;
    dryRun: boolean;
}> {
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

    const options = program.opts<CliOptions>();
    const hasStyle = Boolean(options.style);
    const hasScript = Boolean(options.script);
    const hasAppType = Boolean(options.appType);
    let projectName = program.args[0] as string | undefined;

    // -- VALIDATE FLAGS COMBINATION

    const flagsCount = [hasStyle, hasScript, hasAppType].filter(Boolean).length;

    if (flagsCount > 0 && flagsCount < 3) {
        throw new Error('You must provide --app-type, --style and --script together, or use interactive mode');
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

    // -- PREVENT PROJECT CREATION FROM UNHYPHENATED COMMANDS

    const rawArgs = program.args;

    if (rawArgs.length === 1) {
        const arg = rawArgs[0].toLowerCase();

        if (['version', 'v'].includes(arg)) {
            console.error(`⚠️ Error: '${rawArgs[0]}' is not a valid project name.`);
            console.error('Did you mean to check the version? Use one of these:');
            console.error('create-webpack-starter --version');
            console.error('create-webpack-starter -v');
            process.exit(1);
        }
    }

    // -- INTERACTIVE MODE

    if (!projectName) {
        const answer = await inquirer.prompt<{ projectName: string }>([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name:',
                validate: v => !!v || 'Project name is required'
            }
        ]);

        projectName = answer.projectName;
    }

    let appType: 'mpa' | 'spa';
    let style: 'scss' | 'less';
    let script: 'js' | 'ts';

    if (flagsCount === 3) {
        appType = options.appType as 'mpa' | 'spa';
        style = options.style as 'scss' | 'less';
        script = options.script as 'js' | 'ts';
    } else {
        const answers = await inquirer.prompt<{
            appType: 'mpa' | 'spa';
            style: 'scss' | 'less';
            script: 'js' | 'ts';
        }>([
            {
                type: 'list',
                name: 'appType',
                message: 'Application type:',
                choices: [
                    {name: 'Multi-page application (MPA)', value: 'mpa'},
                    {name: 'Single-page application (SPA)', value: 'spa'}
                ],
                default: 'mpa'
            },
            {
                type: 'list',
                name: 'style',
                message: 'Style preprocessor:',
                choices: [
                    {name: 'SCSS', value: 'scss'},
                    {name: 'Less', value: 'less'}
                ]
            },
            {
                type: 'list',
                name: 'script',
                message: 'Scripts:',
                choices: [
                    {name: 'JavaScript', value: 'js'},
                    {name: 'TypeScript', value: 'ts'}
                ]
            }
        ]);

        appType = answers.appType;
        style = answers.style;
        script = answers.script;
    }

    // -- RESOLVE TEMPLATE

    const template = resolveTemplateKey({appType, style, script});

    if (!template || !templates[template]) {
        throw new Error(`No template found for appType="${appType}", style="${style}", script="${script}"`);
    }

    return {
        projectName,
        template,
        appType,
        noInstall: options.install === false,
        dryRun: Boolean(options.dryRun)
    };
}
