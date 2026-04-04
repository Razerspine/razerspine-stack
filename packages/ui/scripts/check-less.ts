import {execSync} from 'child_process';
import * as path from 'path';

const entry = path.resolve('src/styles/less/ui.less');

console.log('🔍 Checking LESS compilation...');

try {
    execSync(`lessc --no-color "${entry}" /dev/null`, {stdio: 'inherit'});
    console.log('✔ LESS compiled successfully');
} catch {
    console.error('❌ LESS compilation failed');
    process.exit(1);
}
