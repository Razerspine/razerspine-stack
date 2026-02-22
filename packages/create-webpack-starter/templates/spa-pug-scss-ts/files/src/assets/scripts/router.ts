export class Router {
  private readonly root: HTMLElement;

  constructor(private routes: any[]) {
    this.root = document.getElementById('app-root')!;
    this.init();
  }

  private init() {
    window.addEventListener('popstate', () =>
      this.render(window.location.pathname),
    );

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('[data-link]');

      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href') || '/';
        this.navigate(href);
      }
    });

    this.render(window.location.pathname);
  }

  public navigate(path: string) {
    window.history.pushState(null, '', path);
    this.render(path);
  }

  private render(path: string) {
    const route =
      this.routes.find((r) => r.path === path) ||
      this.routes.find((r) => r.path === '/404') ||
      this.routes[0];

    if (route.title) {
      document.title = route.title;
    }

    this.root.innerHTML = '';
    const page = new route.component(this.root);
    page.render();
  }
}
