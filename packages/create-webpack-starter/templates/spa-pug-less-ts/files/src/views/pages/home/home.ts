import '@views/pages/home/style.less';
import template from '@views/pages/home/home.pug';

export class HomePage {
  constructor(private container: HTMLElement) {
  }

  public render() {
    this.container.innerHTML = template();
    this.onInit();
  }

  private onInit() {
    console.log('Home Page loaded!');
  }
}
