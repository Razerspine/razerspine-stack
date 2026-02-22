export class Router {
  constructor(routes) {
    this.routes = routes;
    this.root = document.getElementById('app-root');
    this.init();
  }

  init() {
    window.addEventListener('popstate', () =>
      this.render(window.location.pathname),
    );

    document.addEventListener('click', (e) => {
      const target = e.target;
      const link = target?.closest('[data-link]');

      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href') || '/';
        this.navigate(href);
      }
    });

    this.render(window.location.pathname);
  }

  navigate(path) {
    window.history.pushState(null, '', path);
    this.render(path);
  }

  render(path) {
    const route =
      this.routes.find((r) => r.path === path) ||
      this.routes.find((r) => r.path === '/404') ||
      this.routes[0];

    if (route.title) {
      document.title = route.title;
    }

    if (this.root) {
      this.root.innerHTML = '';
      const page = new route.component(this.root);
      page.render();
    }
  }
}
