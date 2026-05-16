import { href } from "../routes";
import { GitHubIcon } from "./GitHubIcon";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header class="topbar">
      <a class="mark wordmark-small" href={href("home")}>
        <Wordmark />
      </a>
      <nav aria-label="Primary navigation">
        <a class="text-link" href={href("drafts")}>
          Drafts
        </a>
        <a class="icon-link" href="https://github.com/Goaman/fnforge" aria-label="GitHub">
          <GitHubIcon />
        </a>
      </nav>
    </header>
  );
}
