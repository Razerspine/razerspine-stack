import '@views/pages/404/style.scss';
import template from '@views/pages/404/404.pug';
import {BaseComponent, ConsoleLogger} from '@razerspine/starter-core-scripts';

export class NotFoundPage extends BaseComponent<any> {
  private logger = new ConsoleLogger();
  constructor(container: HTMLElement) {
    super(container, {});
  }

  public render() {
    this.container.innerHTML = template();
  }

  protected onInit() {
    this.logger.success('404 Page initialized!');
  }

  protected onDestroy() {
    this.logger.info('404 Page destroyed!');
  }
}
