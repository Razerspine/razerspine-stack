import '@views/pages/home/style.less';
import template from '@views/pages/home/home.pug';
import pkg from '../../../../package.json';
import {BaseComponent, ConsoleLogger} from '@razerspine/starter-core-scripts';

function getPackageMeta(data) {
  const parts = data?.name.split('-');
  return {
    appType: parts?.includes('spa') ? 'SPA' : 'MPA',
    script: parts?.includes('ts') ? 'TypeScript' : 'JavaScript',
    style: parts?.includes('scss') ? 'SCSS' : 'Less',
    version: data?.version || '',
    description: data?.description || '',
  };
}

export class HomePage extends BaseComponent {
  logger = new ConsoleLogger();

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
