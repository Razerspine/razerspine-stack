import '@pages/not-found/style.scss';
import template from '@pages/not-found/not-found.pug';
import {
  BaseComponent,
  ConsoleLogger,
  inject,
} from '@razerspine/runtime';

export class NotFoundPage extends BaseComponent {
  logger = inject(ConsoleLogger);

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
