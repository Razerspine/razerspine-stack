import path from 'node:path';
import fs from 'fs-extra';

const GITIGNORE_CONTENT = `# dependencies
node_modules/

# build output
dist/

# logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# environment
.env
.env.local
.env.*.local

# editor
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db
`;

/**
 * Writes a .gitignore file to the target directory.
 *
 * @param {string} targetDir - The path to the destination directory.
 * @returns {Promise<void>} A promise that resolves when the write operation completes.
 */
export async function writeGitignore(targetDir: string): Promise<void> {
    await fs.writeFile(path.join(targetDir, '.gitignore'), GITIGNORE_CONTENT, 'utf-8');
}
