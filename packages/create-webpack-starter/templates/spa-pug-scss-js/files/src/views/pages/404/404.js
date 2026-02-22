import '@views/pages/404/style.scss';
import template from '@views/pages/404/404.pug';

export class NotFoundPage {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = template();
    this.onInit();
  }

  onInit() {
    console.log('404 Page loaded!');
  }
}
