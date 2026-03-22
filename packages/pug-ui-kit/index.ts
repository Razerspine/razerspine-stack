import * as path from 'path';

export const paths = {
    fonts: path.join(__dirname, '../fonts'),
    scss: path.join(__dirname, '../src/styles/scss'),
    less: path.join(__dirname, '../src/styles/less'),
    pug: path.join(__dirname, '../src/pug')
};

export function getStylePath(type: 'scss' | 'less' = 'scss') {
    return path.join(__dirname, `../src/styles/${type}/ui-kit.${type}`);
}
