import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Recursively retrieves all HTML files from a given directory.
 * Useful for scanning deeply nested MPA directory structures.
 * * @param {string} dir - The absolute path of the directory to scan.
 * @returns {string[]} An array of absolute file paths to HTML files.
 */
export function getHtmlFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
        const filePath = path.resolve(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    }
    return results;
}
