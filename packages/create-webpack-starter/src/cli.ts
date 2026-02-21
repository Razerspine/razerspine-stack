import {Command} from 'commander';
import inquirer from 'inquirer';
import {templates, TemplateKey} from './templates';
import {resolveTemplateKey} from './template-resolver';

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
    let projectName = program.args[0] as string | undefined;

    // --- ASK PROJECT NAME
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

    if (hasStyle !== hasScript) {
        throw new Error('Both --style and --script must be provided together');
    }

    // --- VALIDATE APP TYPE IF PROVIDED
    if (options.appType && !['mpa', 'spa'].includes(options.appType)) {
        throw new Error('Invalid --app-type. Expected "mpa" or "spa"');
    }

    let template: TemplateKey | undefined;

    // --- RESOLVE TEMPLATE FROM FLAGS
    if (hasStyle && hasScript) {
        const resolved = resolveTemplateKey({
            style: options.style,
            script: options.script
        });

        if (!resolved) {
            throw new Error(
                `No template for style="${options.style}" and script="${options.script}"`
            );
        }

        template = resolved;
    }

    // --- INTERACTIVE STYLE + SCRIPT
    if (!template) {
        const answers = await inquirer.prompt<{
            style: 'scss' | 'less';
            script: 'js' | 'ts';
        }>([
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

        const resolved = resolveTemplateKey(answers);

        if (!resolved) {
            throw new Error(
                `No template for style="${answers.style}" and script="${answers.script}"`
            );
        }

        template = resolved;
    }

    if (!template || !templates[template]) {
        throw new Error(`Unknown template: ${template}`);
    }

    // --- APP TYPE (FLAG OR INTERACTIVE)
    let appType: 'mpa' | 'spa' = options.appType ?? 'mpa';

    if (!options.appType) {
        const answer = await inquirer.prompt<{ appType: 'mpa' | 'spa' }>([
            {
                type: 'list',
                name: 'appType',
                message: 'Application type:',
                choices: [
                    {name: 'Multi-page application (MPA)', value: 'mpa'},
                    {name: 'Single-page application (SPA)', value: 'spa'}
                ],
                default: 'mpa'
            }
        ]);

        appType = answer.appType;
    }

    return {
        projectName,
        template,
        appType,
        noInstall: options.install === false,
        dryRun: Boolean(options.dryRun)
    };
}
