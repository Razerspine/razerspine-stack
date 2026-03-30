import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {TEMP_PREFIX} from './temp-prefix';

/**
 * Cleans up all temporary directories created during tests.
 */
export function cleanupTempDirs(): void {
    const tmpDir = os.tmpdir();
    console.log(`🧹 Starting cleanup of temporary directories in: ${tmpDir}`);

    try {
        const files = fs.readdirSync(tmpDir);
        let deletedCount = 0;

        for (const file of files) {
            if (file.startsWith(TEMP_PREFIX)) {
                const fullPath = path.join(tmpDir, file);

                try {
                    fs.rmSync(fullPath, {recursive: true, force: true});
                    deletedCount++;
                    console.log(`  🗑️ Deleted: ${file}`);
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(`  ❌ Failed to delete ${file}: ${err.message}`);
                    }
                }
            }
        }

        console.log(`\n✨ Cleanup complete. Total folders deleted: ${deletedCount}`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`💥 Critical error while reading tmp directory: ${err.message}`);
        }
        process.exit(1);
    }
}
