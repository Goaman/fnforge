import { For } from "solid-js";
import { posts } from "../posts";
import { href, type Route } from "../routes";

type ArticleIndexProps = {
  current: Route;
};

export function ArticleIndex(props: ArticleIndexProps) {
  return (
    <aside class="article-index" aria-label="Articles">
      <p>Articles</p>
      <nav>
        <For each={posts}>
          {(post) => (
            <a classList={{ active: post.route === props.current }} href={href(post.route)}>
              {post.title}
            </a>
          )}
        </For>
      </nav>
    </aside>
  );
}
