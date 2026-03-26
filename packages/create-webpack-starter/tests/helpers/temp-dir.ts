import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { TEMP_PREFIX } from './temp-prefix';

/**
 * Creates a unique temporary directory for test isolation.
 * Logic:
 * 1. os.tmpdir() - Gets the OS-specific temp path.
 * 2. path.join() - Appends the project-specific prefix.
 * 3. fs.mkdtempSync() - Appends 6 random characters to ensure uniqueness.
 * * @returns The full path to the newly created temporary directory.
 */
export function createTempDir(): string {
    const tempBaseDir = path.join(os.tmpdir(), TEMP_PREFIX);
    return fs.mkdtempSync(tempBaseDir);
}
