import {routes} from './routes';
import {
  bootstrapApplication,
  ConsoleLogger,
  provideRouter,
  ThemeService,
} from '@razerspine/runtime';

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
