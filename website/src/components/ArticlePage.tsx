import type { JSX } from 'solid-js';
import type { ArticleMenuItem } from './ArticleMenu';
import { ArticleShell } from './ArticleShell';
import type { Route } from '../routes';

type ArticlePageProps = {
  current: Route;
  title: string;
  lede: string;
  heroExtra?: JSX.Element;
  menuExtra?: JSX.Element;
  menuItems: ArticleMenuItem[];
  children: JSX.Element;
};

export function ArticlePage(props: ArticlePageProps) {
  return (
    <ArticleShell current={props.current} menuItems={props.menuItems} menuExtra={props.menuExtra}>
      <section class="hero article-hero" aria-labelledby="title">
        <h1 id="title">{props.title}</h1>
        <p class="lede">{props.lede}</p>
        {props.heroExtra}
      </section>
      <article class="article-body">{props.children}</article>
    </ArticleShell>
  );
}
