import '@pages/home/style.less';
import template from '@pages/home/home.pug';
import pkg from '../../../package.json';
import {
  BaseComponent,
  ConsoleLogger,
  inject,
} from '@razerspine/starter-core-scripts';

type PackageType = {
  name: string;
  version: string;
  description?: string;
  [key: string]: any;
};

interface HomeState {
  appType: string;
  script: string;
  style: string;
  version: string;
  description: string;
}

function getPackageMeta(data: PackageType) {
  const parts = data?.name.split('-');
  return {
    appType: parts?.includes('spa') ? 'SPA' : 'MPA',
    script: parts?.includes('ts') ? 'TypeScript' : 'JavaScript',
    style: parts?.includes('scss') ? 'SCSS' : 'Less',
    version: data?.version || '',
    description: data?.description || '',
  };
}

export class HomePage extends BaseComponent<HomeState> {
  private logger = inject(ConsoleLogger);

  constructor(container: HTMLElement) {
    super(container, getPackageMeta(pkg));
  }

  public render() {
    this.container.innerHTML = template();
  }

  protected onInit() {
    this.logger.success('Home Page initialized!');
  }

  protected onDestroy() {
    this.logger.info('Home Page Destroyed!');
  }
}
