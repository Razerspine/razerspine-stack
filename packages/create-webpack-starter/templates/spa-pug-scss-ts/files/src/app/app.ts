import {routes} from './routes';
import {
  ConsoleLogger,
  ThemeService,
  bootstrapApplication,
  provideRouter,
} from '@razerspine/starter-core-scripts';

const logger = new ConsoleLogger();
const themeService = new ThemeService();

bootstrapApplication({
  providers: [
    provideRouter(routes),
    {provide: ThemeService, useValue: themeService},
    {provide: ConsoleLogger, useValue: logger},
  ],
})
  .then(() => {
    logger.success('🚀 Application successfully bootstrapped. All systems go!');
  })
  .catch(() => {
    /* Silent catch to prevent Webpack Overlay */
  });
