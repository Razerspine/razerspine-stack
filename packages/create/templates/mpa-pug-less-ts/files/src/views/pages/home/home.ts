import pkg from '../../../../package.json';
import {createStore, applyBindings, ConsoleLogger} from '@razerspine/runtime';

type PackageType = {
  templateMeta: string;
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

export class HomePage {
  private logger = new ConsoleLogger();
  private state: HomeState;

  constructor() {
    const initialData = this.getPackageMeta(pkg);
    const {state} = createStore(initialData, () => this.update());
    this.state = state;

    this.init();
  }

  private init(): void {
    this.update();
    this.logger.success(
      'MPA Home Page initialized with Class-based reactivity!',
    );
  }

  private update(): void {
    applyBindings(document.body, this.state);
  }

  private getPackageMeta(data: PackageType): HomeState {
    const parts = data?.templateMeta.split('-');

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
