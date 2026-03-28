import {HomePage} from '@pages/home/home.page';
import {NotFoundPage} from '@pages/not-found/not-found.page';
import {Route} from '@razerspine/runtime';

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
