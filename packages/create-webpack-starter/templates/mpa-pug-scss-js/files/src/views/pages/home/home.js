import pkg from '../../../../package.json';
import {
  createStore,
  applyBindings,
  ConsoleLogger,
} from '@razerspine/starter-core-scripts';

export class HomePage {
  logger = new ConsoleLogger();

  constructor() {
    const initialData = this.getPackageMeta(pkg);
    const {state} = createStore(initialData, () => this.update());
    this.state = state;

    this.init();
  }

  init() {
    this.update();
    this.logger.success(
      'MPA Home Page initialized with Class-based reactivity!',
    );
  }

  update() {
    applyBindings(document.body, this.state);
  }

  getPackageMeta(data) {
    const parts = data?.name.split('-');
    return {
      appType: parts?.includes('spa') ? 'SPA' : 'MPA',
      script: parts?.includes('ts') ? 'TypeScript' : 'JavaScript',
      style: parts?.includes('scss') ? 'SCSS' : 'Less',
      version: data?.version || '',
      description: data?.description || '',
    };
  }
}

document.addEventListener('DOMContentLoaded', () => new HomePage());
