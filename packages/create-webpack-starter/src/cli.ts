import {Command} from 'commander';
import inquirer from 'inquirer';
import {templates, TemplateKey} from './templates';
import {resolveTemplateKey} from './template-resolver';

type CliOptions = {
    template?: TemplateKey;
    style?: 'scss' | 'less';
    script: 'js' | 'ts';
    install?: boolean;
    dryRun?: boolean;
};

export async function getCliContext(): Promise<{
    projectName: string;
    template: TemplateKey;
    noInstall: boolean;
    dryRun: boolean;
}> {
    const program = new Command();

    program
        .argument('[project-name]', 'Project name')
        .option('-t, --template <template>', 'Template name')
        .option('--style <style>', 'Style preprocessor (scss or less)')
        .option('--script <script>', 'Script type (js or ts)')
        .option('--no-install', 'Skip npm install')
        .option('--dry-run', 'Do not write files');

    program.parse(process.argv);

    const options = program.opts<CliOptions>();

    let projectName = program.args[0] as string | undefined;

    // --- ASK PROJECT NAME IF NOT PROVIDED
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

    let template: TemplateKey | undefined = options.template;

    // --- RESOLVE TEMPLATE FROM STYLE + SCRIPT (only if template not provided)
    if (!template) {
        const resolved = resolveTemplateKey({
            style: options.style,
            script: options.script
        });

        if (resolved) {
            template = resolved;
        }
    }

    // --- ASK TEMPLATE IF NOT PROVIDED
    if (!template) {
        const answer = await inquirer.prompt<{ template: TemplateKey }>([
            {
                type: 'list',
                name: 'template',
                message: 'Choose a template:',
                choices: Object.values(templates).map(t => ({
                    name: t.meta.description,
                    value: t.key
                }))
            }
        ]);

        template = answer.template;
    }

    if (!template || !templates[template]) {
        throw new Error(`Unknown template: ${template}`);
    }

    return {
        projectName,
        template,
        noInstall: options.install === false,
        dryRun: Boolean(options.dryRun)
    };
}
