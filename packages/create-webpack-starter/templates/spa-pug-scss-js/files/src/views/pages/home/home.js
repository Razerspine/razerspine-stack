import '@views/pages/home/style.scss';
import template from '@views/pages/home/home.pug';
import pkg from '../../../../package.json';

export class HomePage {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = template();
    this.onInit();
  }

  onInit() {
    console.log('Home Page loaded!');
    const meta = getPackageMeta(pkg);
    renderMeta(this.container, meta);
  }
}

function getPackageMeta(data) {
  const parts = data?.name?.split('-') || [];

  return {
    appType: parts.includes('spa') ? 'SPA' : 'MPA',
    script: parts.includes('ts') ? 'TypeScript' : 'JavaScript',
    style: parts.includes('scss') ? 'SCSS' : 'Less',
    version: data?.version || '',
    description: data?.description || '',
  };
}

function renderMeta(container, meta) {
  const elements = container.querySelectorAll('[data-bind]');
  elements.forEach((el) => {
    const key = el.dataset.bind;
    if (key && key in meta) {
      el.textContent = meta[key];
    }
  });
}
