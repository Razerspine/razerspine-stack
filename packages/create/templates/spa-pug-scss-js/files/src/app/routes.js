import {HomePage} from '@pages/home/home.page';
import {NotFoundPage} from '@pages/not-found/not-found.page';

export const routes = [
  {
    path: '/',
    component: HomePage,
    title: 'Razerspine SPA Template',
  },
  {
    path: '/404',
    component: NotFoundPage,
    title: 'Page Not Found',
  },
];
