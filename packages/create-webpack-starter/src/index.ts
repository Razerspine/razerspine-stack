#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import inquirer from 'inquirer';

import {getCliContext} from './cli';
import {templates} from './templates';
import {copyTemplate} from './copier';
import {installDeps} from './installer';
import {log} from './logger';

process.on('unhandledRejection', (err: any) => {
    if (err?.isTtyError || err?.name === 'ExitPromptError') {
        log.info('Cancelled by user');
        process.exit(130);
    }
});

async function run() {
    const spinner = ora();

    try {
        const {
            projectName,
            template: templateKey,
            noInstall,
            dryRun
        } = await getCliContext();

        const template = templates[templateKey];
        if (!template) {
            throw new Error(`Unknown template: ${templateKey}`);
        }

        if (!template.filesPath) {
            throw new Error(`Template '${templateKey}' has no filesPath`);
        }

        const targetDir = path.resolve(process.cwd(), projectName);

        log.info(`Creating project: ${projectName}`);
        log.info(`Template: ${templateKey}`);

        // --- Copy template (SAFE)
        if (dryRun) {
            if (fs.existsSync(targetDir)) {
                spinner.warn(`[dry-run] Directory "${projectName}" already exists`);
            }
            spinner.info('[dry-run] Template would be copied');
        } else {
            // ⛔ overwrite decision happens ONLY here
            if (fs.existsSync(targetDir)) {
                spinner.stop();

                const {overwrite} = await inquirer.prompt<{ overwrite: boolean }>([
                    {
                        type: 'confirm',
                        name: 'overwrite',
                        message: `Directory "${projectName}" already exists. Overwrite?`,
                        default: false
                    }
                ]);

                if (!overwrite) {
                    log.info('Cancelled by user');
                    process.exit(0);
                }

                spinner.start('Cleaning target directory...');
                await fs.remove(targetDir);
                spinner.succeed('Directory cleaned');
            }

            spinner.start('Copying template...');
            await copyTemplate(template.filesPath, targetDir);
            spinner.succeed('Template copied');
        }

        // --- Script cleanup (JS vs TS)
        if (!dryRun && template.meta?.features?.script) {
            const pkgPath = path.join(targetDir, 'package.json');
            const pkg = await fs.readJson(pkgPath);

            if (template.meta.features.script === 'ts') {
                delete pkg.devDependencies?.['@babel/core'];
                delete pkg.devDependencies?.['@babel/preset-env'];
                delete pkg.devDependencies?.['babel-loader'];

                await fs.remove(path.join(targetDir, '.babelrc'));
                await fs.remove(path.join(targetDir, 'babel.config.js'));
            }

            if (template.meta.features.script === 'js') {
                delete pkg.devDependencies?.['typescript'];
                delete pkg.devDependencies?.['ts-loader'];

                await fs.remove(path.join(targetDir, 'tsconfig.json'));
            }

            await fs.writeJson(pkgPath, pkg, {spaces: 2});
        }

        // --- Install deps
        if (noInstall) {
            spinner.info('Skipping install');
        } else if (dryRun) {
            spinner.info('[dry-run] Would install dependencies');
        } else {
            spinner.start('Installing dependencies...');
            await installDeps(targetDir);
            spinner.succeed('Dependencies installed');
        }

        log.success('Done!');
    } catch (err: any) {
        spinner.stop();
        console.error('❌ Error:', err?.message || err);
        process.exit(1);
    }
}

run().then();
