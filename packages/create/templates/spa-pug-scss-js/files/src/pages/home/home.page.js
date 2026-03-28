import '@pages/home/style.scss';
import template from '@pages/home/home.pug';
import pkg from '../../../package.json';
import {BaseComponent, ConsoleLogger, inject} from '@razerspine/runtime';

function getPackageMeta(data) {
  const parts = data?.templateMeta.split('-');

  return {
    appType: parts?.includes('spa') ? 'SPA' : 'MPA',
    script: parts?.includes('ts') ? 'TypeScript' : 'JavaScript',
    style: parts?.includes('scss') ? 'SCSS' : 'Less',
    version: data?.version || '',
    description: data?.description || '',
  };
}

export class HomePage extends BaseComponent {
  logger = inject(ConsoleLogger);

  constructor(container) {
    super(container, getPackageMeta(pkg));
  }

  render() {
    this.container.innerHTML = template();
  }

  onInit() {
    this.logger.success('Home Page initialized!');
  }

  onDestroy() {
    this.logger.info('Home Page Destroyed!');
  }
}
