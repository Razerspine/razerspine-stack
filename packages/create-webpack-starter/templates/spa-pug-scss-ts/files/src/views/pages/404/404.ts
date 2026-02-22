import '@views/pages/404/style.scss';
import template from '@views/pages/404/404.pug';

export class NotFoundPage {
  constructor(private container: HTMLElement) {}

  public render() {
    this.container.innerHTML = template();
    this.onInit();
  }

  private onInit() {
    console.log("404 Page loaded!");
  }
}
