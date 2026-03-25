import {parseCliArgs} from './parse-args';
import {validateOptions} from './validate-options';
import {validateRawArgs} from './validate-args';
import {promptProjectName, promptFeatures} from './prompt';
import {resolveTemplate} from './resolve-template';

import {TemplateKey} from '../templates/templates';

/**
 * Final CLI context passed to application core.
 */
export type CliContext = {
    projectName: string;
    template: TemplateKey;
    appType: 'mpa' | 'spa';
    noInstall: boolean;
    dryRun: boolean;
};

/**
 * Main CLI entry that orchestrates:
 * - parsing
 * - validation
 * - prompting
 * - template resolution
 */
export async function getCliContext(): Promise<CliContext> {
    const {options, projectName: rawName, rawArgs} = parseCliArgs();

    validateOptions(options);
    validateRawArgs(rawArgs);

    let projectName = rawName;

    if (!projectName) {
        projectName = await promptProjectName();
    }

    const hasAllFlags = options.appType && options.style && options.script;

    let appType: 'mpa' | 'spa';
    let style: 'scss' | 'less';
    let script: 'js' | 'ts';

    if (hasAllFlags) {
        appType = options.appType!;
        style = options.style!;
        script = options.script!;
    } else {
        const answers = await promptFeatures();
        appType = answers.appType;
        style = answers.style;
        script = answers.script;
    }

    const template = resolveTemplate({appType, style, script});

    return {
        projectName,
        template,
        appType,
        noInstall: options.install === false,
        dryRun: Boolean(options.dryRun)
    };
}
