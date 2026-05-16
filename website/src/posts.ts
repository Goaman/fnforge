import type { ArticleRoute } from './routes';

export type Post = {
  route: ArticleRoute;
  slug: string;
  title: string;
  description: string;
};

export const posts: Post[] = [
  {
    route: 'function',
    slug: 'what-is-a-function',
    title: 'Functions need a unified spec',
    description:
      'A note about using one function description to solve calling, discovery, UI, reactivity, and integration together.',
  },
  {
    route: 'flow',
    slug: 'server-client-flow',
    title: 'Server client flow',
    description:
      'A visual reference for how state moves into transport, crosses the server/client boundary, and updates the client view.',
  },
  {
    route: 'choosing-output',
    slug: 'choosing-the-output-of-a-function',
    title: 'Choosing the output of a function',
    description:
      'A note about treating function output as an explicit product surface, not only the accidental return value of implementation code.',
  },
];
