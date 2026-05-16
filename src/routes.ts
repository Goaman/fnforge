import { posts } from './posts';

export type ArticleRoute = 'function' | 'flow';
export type Route = 'home' | 'drafts' | ArticleRoute;

export function routeFromLocation(): Route {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/drafts') {
    return 'drafts';
  }

  const draft = posts.find((post) => path === `/draft/${post.slug}`);

  if (draft) {
    return draft.route;
  }

  return 'home';
}

export function href(route: Route) {
  if (route === 'home') {
    return '/';
  }

  if (route === 'drafts') {
    return '/drafts';
  }

  const post = posts.find((draft) => draft.route === route);

  return post ? `/draft/${post.slug}` : '/';
}
