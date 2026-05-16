import { For } from 'solid-js';
import { posts } from '../posts';
import { href } from '../routes';

export function DraftPostsPage() {
  return (
    <>
      <section class="hero draft-hero">
        <p class="eyebrow">draft posts</p>
        <h1>notes in progress</h1>
        <p class="lede">Loose technical drafts for fnforge. These are working notes first, polished posts later.</p>
      </section>

      <section class="post-list" aria-label="Draft posts">
        <For each={posts}>
          {(post) => (
            <a class="post-card featured" href={href(post.route)}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </a>
          )}
        </For>
      </section>
    </>
  );
}
