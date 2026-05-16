import { For, type JSX } from 'solid-js';

export type ArticleMenuItem = {
  href: string;
  label: string;
  items?: ArticleMenuItem[];
};

type ArticleMenuProps = {
  items: ArticleMenuItem[];
  extra?: JSX.Element;
};

export function ArticleMenu(props: ArticleMenuProps) {
  const scrollToSection = (event: MouseEvent, href: string) => {
    event.preventDefault();
    event.stopPropagation();
    const nextUrl = `${window.location.pathname}${href}`;

    window.history.pushState({}, '', nextUrl);
    const target = document.querySelector(href);

    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (target instanceof HTMLElement) {
      window.setTimeout(() => {
        target.classList.remove('anchor-highlight');
        void target.offsetWidth;
        target.classList.add('anchor-highlight');
        window.setTimeout(() => {
          target.classList.remove('anchor-highlight');
        }, 900);
      }, 350);
    }
  };
  const sectionHref = (href: string) => `${window.location.pathname}${href}`;

  return (
    <aside class="article-menu" aria-label="Article sections">
      <p>In this article</p>
      {props.extra}
      <nav>
        <For each={props.items}>
          {(item) => (
            <div class="article-menu-group">
              <a href={sectionHref(item.href)} onClick={(event) => scrollToSection(event, item.href)}>
                {item.label}
              </a>
              <For each={item.items}>
                {(child) => (
                  <a
                    class="article-menu-child"
                    href={sectionHref(child.href)}
                    onClick={(event) => scrollToSection(event, child.href)}
                  >
                    {child.label}
                  </a>
                )}
              </For>
            </div>
          )}
        </For>
      </nav>
    </aside>
  );
}
