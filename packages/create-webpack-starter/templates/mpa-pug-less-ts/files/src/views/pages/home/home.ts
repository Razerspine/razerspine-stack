import pkg from '../../../../package.json';

(async () => {
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

  function renderMeta(meta: TemplateMeta) {
    const elements = document.querySelectorAll<HTMLElement>('[data-bind]');
    elements.forEach((el) => {
      const key = el.dataset.bind;
      if (key && key in meta) {
        el.textContent = meta[key as keyof typeof meta];
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const meta = getPackageMeta(pkg);
    renderMeta(meta);
  });
})();
