import { Wordmark } from '../components/Wordmark';
import { href } from '../routes';

export function HomePage() {
  return (
    <>
      <section class="hero home-hero">
        <h1>
          <Wordmark />
        </h1>
      </section>

      <div class="actions">
        <a class="button primary" href={href('drafts')}>
          Read draft posts
        </a>
      </div>
    </>
  );
}
