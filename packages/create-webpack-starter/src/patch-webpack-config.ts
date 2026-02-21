import path from 'path';
import fs from 'fs-extra';
import {readFile, writeFile} from 'fs/promises';

export type AppType = 'spa' | 'mpa';

export async function patchWebpackConfig(
    targetDir: string,
    appType: AppType
) {
    const webpackConfigPath = path.join(targetDir, 'webpack.config.js');

    if (!(await fs.pathExists(webpackConfigPath))) {
        return;
    }

    let configContent = await readFile(webpackConfigPath, 'utf8');

    configContent = configContent
        .replace(/__APP_TYPE__/g, appType)
        .replace(
            /__TEMPLATES_ENTRY__/g,
            appType === 'spa'
                ? 'src/views/app.pug'
                : 'src/views/pages'
        );

    await writeFile(webpackConfigPath, configContent);
}
