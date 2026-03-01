import {HomePage} from '@views/pages/home/home';
import {NotFoundPage} from '@views/pages/404/404';
import {Route} from '@razerspine/starter-core-scripts';

export const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
    title: 'Webpack SPA Starter',
  },
  {
    path: '/404',
    component: NotFoundPage,
    title: 'Page Not Found',
  },
];
