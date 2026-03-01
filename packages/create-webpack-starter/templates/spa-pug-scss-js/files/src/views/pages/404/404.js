import '@views/pages/404/style.scss';
import template from '@views/pages/404/404.pug';
import {BaseComponent, ConsoleLogger} from '@razerspine/starter-core-scripts';

export class NotFoundPage extends BaseComponent {
  logger = new ConsoleLogger();

  constructor(container) {
    super(container, {});
  }

  render() {
    this.container.innerHTML = template();
  }

  onInit() {
    this.logger.success('404 Page initialized!');
  }

  onDestroy() {
    this.logger.info('404 Page destroyed!');
  }
}
