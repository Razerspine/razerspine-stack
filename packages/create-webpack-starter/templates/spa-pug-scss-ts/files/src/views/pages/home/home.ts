import '@views/pages/home/style.scss';
import template from '@views/pages/home/home.pug';
import pkg from '../../../../package.json';

type TemplateMeta = {
  appType: string;
  script: string;
  style: string;
  version: string;
  description: string;
};

type PackageType = {
  name: string;
  version: string;
  description?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [key: string]: any;
};

export class HomePage {
  constructor(
    private container: HTMLElement
  ) {
  }

  public render() {
    this.container.innerHTML = template();
    this.onInit();
  }

  private onInit() {
    console.log('Home Page loaded!');
    const meta = getPackageMeta(pkg);
    renderMeta(this.container, meta);
  }
}

function getPackageMeta(data: PackageType) {
  const parts = data?.name.split('-');
  return {
    appType: parts?.includes('spa') ? 'SPA' : 'MPA',
    script: parts?.includes('ts') ? 'TypeScript' : 'JavaScript',
    style: parts?.includes('scss') ? 'SCSS' : 'Less',
    version: data?.version || '',
    description: data?.description || ''
  };
}

function renderMeta(container: HTMLElement, meta: TemplateMeta) {
  const elements = container.querySelectorAll<HTMLElement>('[data-bind]');
  elements.forEach((el) => {
    const key = el.dataset.bind;
    if (key && key in meta) {
      el.textContent = meta[key as keyof typeof meta];
    }
  });
}
