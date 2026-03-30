import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['tests/**/*.test.ts'],
        globalSetup: ['./tests/helpers/global-setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
        },
    },
});
