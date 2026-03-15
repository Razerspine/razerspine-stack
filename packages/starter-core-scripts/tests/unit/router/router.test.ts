import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {Router} from '../../../src';
import {silenceConsole} from '../../helpers/silence-console';

class TestPage {
    constructor(public root: HTMLElement) {
    }

    render() {
        this.root.innerHTML = '<div>test-page</div>';
    }
}

class MountPage {
    constructor(public root: HTMLElement) {
    }

    mount() {
        this.root.innerHTML = '<div>mounted</div>';
    }
}

class DestroyPage {
    destroyed = false;

    constructor(public root: HTMLElement) {
    }

    render() {
        this.root.innerHTML = '<div>destroy-page</div>';
    }

    destroy() {
        this.destroyed = true;
    }
}

describe('Router', () => {

    let errorSpy: any;

    beforeEach(() => {
        document.body.innerHTML = `<div id="app-root"></div>`;
        window.history.pushState({}, '', '/');

        errorSpy = silenceConsole('error');
    });

    afterEach(() => {
        errorSpy.mockRestore();
    });

    it('renders component for matching route', async () => {
        const router = new Router([{path: '/', component: TestPage}]);

        router.start();
        await Promise.resolve();

        const root = document.getElementById('app-root')!;
        expect(root.innerHTML).toContain('test-page');
    });

    it('calls mount lifecycle if present', async () => {
        const router = new Router([{path: '/', component: MountPage}]);

        router.start();
        await Promise.resolve();

        const root = document.getElementById('app-root')!;
        expect(root.innerHTML).toContain('mounted');
    });

    it('updates document title if route defines title', async () => {
        const router = new Router([
            {path: '/', component: TestPage, title: 'Home'}
        ]);

        router.start();
        await Promise.resolve();

        expect(document.title).toBe('Home');
    });

    it('navigates programmatically', async () => {
        const router = new Router([
            {path: '/', component: TestPage},
            {path: '/about', component: MountPage}
        ]);

        router.start();
        await router.navigate('/about');

        const root = document.getElementById('app-root')!;
        expect(root.innerHTML).toContain('mounted');
    });

    it('calls destroy on previous page when navigating', async () => {
        const router = new Router([
            {path: '/', component: DestroyPage},
            {path: '/next', component: TestPage}
        ]);

        router.start();
        await Promise.resolve();

        const firstPage = (router as any).currentPage;

        await router.navigate('/next');

        expect(firstPage.destroyed).toBe(true);
    });

    it('blocks navigation when guard returns false', async () => {
        const guard = vi.fn().mockResolvedValue(false);

        const router = new Router([
            {path: '/', component: TestPage},
            {path: '/secret', component: MountPage, canActivate: [guard]}
        ]);

        router.start();
        await router.navigate('/secret');

        const root = document.getElementById('app-root')!;
        expect(root.innerHTML).toContain('test-page');
    });

    it('redirects when guard returns a string', async () => {
        const guard = vi.fn().mockResolvedValue('/');

        const router = new Router([
            {path: '/', component: TestPage},
            {path: '/secret', component: MountPage, canActivate: [guard]}
        ]);

        router.start();
        await router.navigate('/secret');

        const root = document.getElementById('app-root')!;
        expect(root.innerHTML).toContain('test-page');
    });

    it('handles guard errors internally', async () => {
        const guard = vi.fn().mockRejectedValue(new Error('guard error'));

        const router = new Router([
            {path: '/', component: TestPage},
            {path: '/secret', component: MountPage, canActivate: [guard]}
        ]);

        const errorHandler = vi.fn();
        router.onNavigationError = errorHandler;

        router.start();

        await router.navigate('/secret');

        expect(errorHandler).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
    });

    it('falls back to /404 route if path not found', async () => {
        const router = new Router([
            {path: '/', component: TestPage},
            {path: '/404', component: MountPage}
        ]);

        router.start();
        await router.navigate('/unknown');

        const root = document.getElementById('app-root')!;
        expect(root.innerHTML).toContain('mounted');
    });
});
