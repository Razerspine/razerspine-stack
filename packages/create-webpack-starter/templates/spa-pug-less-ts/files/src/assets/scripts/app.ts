import {routes} from './routes';
import {ConsoleLogger, Router} from '@razerspine/starter-core-scripts';

(() => {
  const logger = new ConsoleLogger();
  logger.success('app.ts successfully initialized and is now active!');
  document.addEventListener('DOMContentLoaded', () => {
    new Router(routes);
  });
})();
