import {cleanupTempDirs} from './cleanup';

/**
 * Global setup/teardown for Vitest
 * This function is called once before all tests and once after.
 */
export function setup(): void {
    console.log('\n🚀 Starting test suite. Running initial cleanup...');
    cleanupTempDirs();
}

export function teardown(): void {
    console.log('\n🏁 All tests finished. Running final cleanup...');
    cleanupTempDirs();
}
