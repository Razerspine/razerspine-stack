import {describe, it, expect, beforeEach} from 'vitest';
import {bootstrapApplication, BaseComponent, Route} from '../../src';

class HomePage extends BaseComponent<{ message: string }> {

    constructor(container: HTMLElement) {
        super(container, {message: 'Hello'});
    }

    render() {
        this.container.innerHTML = `
            <h1 data-bind="message"></h1>
            <a href="/about" data-link>About</a>
        `;
    }

    protected onInit(): void {
        this.setState({message: 'Home Page'});
    }
}

class AboutPage extends BaseComponent<{ text: string }> {

    constructor(container: HTMLElement) {
        super(container, {text: 'About'});
    }

    render() {
        this.container.innerHTML = `
            <h1 data-bind="text"></h1>
        `;
    }
}

describe('Runtime SPA Flow', () => {

    beforeEach(() => {
        document.body.innerHTML = `<div id="app-root"></div>`;
        window.history.pushState({}, '', '/');
    });

    it('should bootstrap and render initial route', async () => {

        const routes: Route[] = [
            {path: '/', component: HomePage},
            {path: '/about', component: AboutPage}
        ];

        await bootstrapApplication({
            routes,
            rootId: 'app-root'
        });

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('Home Page');
    });

    it('should navigate between routes', async () => {

        const routes: Route[] = [
            {path: '/', component: HomePage},
            {path: '/about', component: AboutPage}
        ];

        await bootstrapApplication({
            routes,
            rootId: 'app-root'
        });

        const link = document.querySelector('[data-link]') as HTMLElement;

        link.click();

        await new Promise(r => setTimeout(r, 0));

        const root = document.getElementById('app-root')!;

        expect(root.innerHTML).toContain('About');
    });

    it('should destroy previous component on navigation', async () => {

        let destroyed = false;

        class TestPage extends BaseComponent<{}> {

            constructor(container: HTMLElement) {
                super(container, {});
            }

            render() {
                this.container.innerHTML = `<p>Test</p>`;
            }

            protected onDestroy(): void {
                destroyed = true;
            }
        }

        class NextPage extends BaseComponent<{}> {

            constructor(container: HTMLElement) {
                super(container, {});
            }

            render() {
                this.container.innerHTML = `<p>Next</p>`;
            }
        }

        const routes: Route[] = [
            {path: '/', component: TestPage},
            {path: '/next', component: NextPage}
        ];

        await bootstrapApplication({
            routes,
            rootId: 'app-root'
        });

        window.history.pushState({}, '', '/next');

        window.dispatchEvent(new PopStateEvent('popstate'));

        await new Promise(r => setTimeout(r, 0));

        expect(destroyed).toBe(true);
    });
});
