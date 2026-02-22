import '@views/pages/home/style.less';
import template from '@views/pages/home/home.pug';

export class HomePage {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = template();
    this.onInit();
  }

  onInit() {
    console.log('Home Page loaded!');
  }
}
