import {spawn} from 'child_process';

export function installDeps(cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn('npm', ['install'], {
            cwd,
            stdio: 'inherit',
            shell: true
        });

        child.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error('npm install failed'));
        });
    });
}
