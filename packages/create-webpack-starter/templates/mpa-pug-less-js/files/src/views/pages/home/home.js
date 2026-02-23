import pkg from '../../../../package.json';

(async () => {
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

  function renderMeta(meta) {
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach((el) => {
      const key = el.dataset.bind;
      if (key && key in meta) {
        el.textContent = meta[key];
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const meta = getPackageMeta(pkg);
    renderMeta(meta);
  });
})();
