import * as fs from 'fs';
import * as path from 'path';

function copyDir(src: string, dest: string) {
    if (!fs.existsSync(src)) return;

    fs.mkdirSync(dest, {recursive: true});

    for (const item of fs.readdirSync(src)) {
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

copyDir(path.join(root, 'src/styles/scss'), path.join(root, 'dist/scss'));
copyDir(path.join(root, 'src/styles/less'), path.join(root, 'dist/less'));
copyDir(path.join(root, 'src/pug'), path.join(root, 'dist/pug'));

console.log('✔ Assets copied successfully');
