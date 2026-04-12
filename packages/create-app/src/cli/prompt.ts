import inquirer from 'inquirer';
import {TemplateFeatures} from '../templates/types';
import {PackageManager} from '../utils';

/**
 * Prompts for project name if not provided.
 */
export async function promptProjectName(): Promise<string> {
    const answer = await inquirer.prompt<{ projectName: string }>([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name:',
            validate: v => !!v || 'Project name is required'
        }
    ]);

    return answer.projectName;
}

/**
 * Prompts for package manager selection.
 */
export async function promptPm(): Promise<PackageManager> {
    const answer = await inquirer.prompt<{ pm: PackageManager }>([
        {
            type: 'list',
            name: 'pm',
            message: 'Package manager:',
            choices: [
                {name: 'npm', value: 'npm'},
                {name: 'pnpm', value: 'pnpm'},
                {name: 'yarn', value: 'yarn'},
                {name: 'bun', value: 'bun'}
            ],
            default: 'npm'
        }
    ]);

    return answer.pm;
}

/**
 * Prompts for missing feature flags.
 */
export async function promptFeatures(): Promise<TemplateFeatures> {
    return inquirer.prompt([
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
}
