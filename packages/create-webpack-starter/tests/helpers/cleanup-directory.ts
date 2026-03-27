import fs from 'fs';

export function cleanupDirectory(dir: string) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {recursive: true, force: true});
    }
}
