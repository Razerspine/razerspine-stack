import * as path from 'path';

export const paths = {
    fonts: path.join(__dirname, '../fonts'),
    scss: path.join(__dirname, './scss'),
    less: path.join(__dirname, './less'),
    mixins: path.join(__dirname, './pug/mixins')
};

export function getStylePath(type: 'scss' | 'less' = 'scss') {
    return path.join(__dirname, `./${type}/ui.${type}`);
}
