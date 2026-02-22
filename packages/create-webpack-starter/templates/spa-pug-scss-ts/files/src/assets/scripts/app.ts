import {Router} from './router';
import {routes} from './routes';
import {ConsoleLogger} from '@razerspine/starter-core-scripts';

document.addEventListener('DOMContentLoaded', () => {
  const logger = new ConsoleLogger();
  logger.success('app.ts successfully initialized and is now active!');

  new Router(routes);
});
