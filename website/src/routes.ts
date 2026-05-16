import { posts } from './posts';

export type ArticleRoute = 'function' | 'flow';
export type Route = 'home' | 'drafts' | ArticleRoute;

const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function pathWithoutBase(pathname = window.location.pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (!basePath || basePath === '/') {
    return path;
  }

  if (path === basePath) {
    return '/';
  }

  if (path.startsWith(`${basePath}/`)) {
    return path.slice(basePath.length) || '/';
  }

  return path;
}

function withBase(path: string) {
  if (!basePath || basePath === '/') {
    return path;
  }

  return path === '/' ? `${basePath}/` : `${basePath}${path}`;
}

export function routeFromLocation(): Route {
  const path = pathWithoutBase();

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
    return withBase('/');
  }

  if (route === 'drafts') {
    return withBase('/drafts');
  }

  const post = posts.find((draft) => draft.route === route);

  return post ? withBase(`/draft/${post.slug}`) : withBase('/');
}
