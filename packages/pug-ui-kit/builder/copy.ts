import * as fs from 'fs';
import * as path from 'path';

function copyDir(src: string, dest: string) {
    if (!fs.existsSync(src)) {
        console.warn(`⚠ Source not found: ${src}`);
        return;
    }

    fs.mkdirSync(dest, {recursive: true});

    for (const item of fs.readdirSync(src)) {
        if (item.endsWith('.map')) continue;

        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

const root = process.cwd();

try {
    copyDir(
        path.join(root, 'src/styles/scss'),
        path.join(root, 'dist/scss')
    );
    console.log('✔ SCSS copied');

    copyDir(
        path.join(root, 'src/styles/less'),
        path.join(root, 'dist/less')
    );
    console.log('✔ LESS copied');

    copyDir(
        path.join(root, 'src/pug'),
        path.join(root, 'dist/pug')
    );
    console.log('✔ PUG copied');

    console.log('🚀 Assets build completed');
} catch (e) {
    console.error('❌ Copy failed:', e);
    process.exit(1);
}
