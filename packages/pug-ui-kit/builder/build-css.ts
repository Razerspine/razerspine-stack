import {execSync} from 'child_process';

export function buildCSS() {
    execSync(
        'sass src/styles/scss/ui-kit.scss dist/css/ui.css',
        { stdio: 'inherit' }
    );

    execSync(
        'postcss dist/css/ui.css --config postcss.config.js --output dist/css/ui.min.css',
        { stdio: 'inherit' }
    );
}
