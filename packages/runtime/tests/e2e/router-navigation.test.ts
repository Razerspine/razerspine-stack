import {describe, it, expect, beforeEach} from 'vitest';
import {Router, Route, BaseComponent} from '../../src';

class HomePage extends BaseComponent<{}> {
    constructor(container: HTMLElement) {
        super(container, {});
    }

    render() {
        this.container.innerHTML = `
            <h1>Home</h1>
            <a href="/about" data-link>About</a>
        `;
    }
}

class AboutPage extends BaseComponent<{}> {
    constructor(container: HTMLElement) {
        super(container, {});
    }

    render() {
        this.container.innerHTML = `<h1>About</h1>`;
    }
}

class NotFoundPage extends BaseComponent<{}> {
    constructor(container: HTMLElement) {
        super(container, {});
    }

    render() {
        this.container.innerHTML = `<h1>404</h1>`;
    }
}

describe('Router Navigation', () => {

    let router: Router;

    beforeEach(() => {

        document.body.innerHTML = `<div id="app-root"></div>`;
        window.history.pushState({}, '', '/');

        const routes: Route[] = [
            {path: '/', component: HomePage},
            {path: '/about', component: AboutPage},
            {path: '/404', component: NotFoundPage}
        ];

        router = new Router(routes, 'app-root');
        router.start();
    });

    it('should render initial route', async () => {

        await new Promise(r => setTimeout(r, 0));

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('Home');
    });

    it('should navigate programmatically', async () => {

        await router.navigate('/about');

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('About');
    });

    it('should navigate via data-link click', async () => {

        const link = document.querySelector('[data-link]') as HTMLElement;

        link.click();

        await new Promise(r => setTimeout(r, 0));

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('About');
    });

    it('should handle browser popstate navigation', async () => {

        await router.navigate('/about');

        window.history.pushState({}, '', '/');

        window.dispatchEvent(new PopStateEvent('popstate'));

        await new Promise(r => setTimeout(r, 0));

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('Home');
    });

    it('should block navigation when guard returns false', async () => {

        const guardedRoutes: Route[] = [
            {
                path: '/',
                component: HomePage
            },
            {
                path: '/about',
                component: AboutPage,
                canActivate: [() => false]
            }
        ];

        router = new Router(guardedRoutes, 'app-root');
        router.start();

        await router.navigate('/about');

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('Home');
    });

    it('should redirect when guard returns redirect path', async () => {

        const guardedRoutes: Route[] = [
            {
                path: '/',
                component: HomePage
            },
            {
                path: '/protected',
                component: AboutPage,
                canActivate: [() => '/']
            }
        ];

        router = new Router(guardedRoutes, 'app-root');
        router.start();

        await router.navigate('/protected');

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('Home');
    });

    it('should render 404 fallback for unknown route', async () => {

        window.history.pushState({}, '', '/unknown');

        router = new Router([
            {path: '/', component: HomePage},
            {path: '/404', component: NotFoundPage}
        ], 'app-root');

        router.start();

        await new Promise(r => setTimeout(r, 0));

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('404');
    });
});
