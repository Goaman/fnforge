import type { JSX } from "solid-js";
import { ArticleIndex } from "./ArticleIndex";
import { ArticleMenu, type ArticleMenuItem } from "./ArticleMenu";
import type { Route } from "../routes";

type ArticleShellProps = {
  current: Route;
  menuItems: ArticleMenuItem[];
  menuExtra?: JSX.Element;
  children: JSX.Element;
};

export function ArticleShell(props: ArticleShellProps) {
  return (
    <div class="article-shell">
      <ArticleIndex current={props.current} />
      <main class="article-main">{props.children}</main>
      <ArticleMenu items={props.menuItems} extra={props.menuExtra} />
    </div>
  );
}
