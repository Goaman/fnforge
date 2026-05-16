import { createEffect, createSignal, Match, onCleanup, Switch } from 'solid-js';
import { Header } from './components/Header';
import { DraftPostsPage } from './pages/DraftPostsPage';
import { ChoosingOutputPage } from './pages/ChoosingOutputPage';
import { FlowPage } from './pages/FlowPage';
import { FunctionPage } from './pages/FunctionPage';
import { HomePage } from './pages/HomePage';
import { href, pathWithoutBase, routeFromLocation, type Route } from './routes';

function highlightAnchor(hash: string, delay = 0) {
  const target = document.querySelector(hash);

  if (!(target instanceof HTMLElement)) {
    return;
  }

  window.setTimeout(() => {
    target.classList.remove('anchor-highlight');
    void target.offsetWidth;
    target.classList.add('anchor-highlight');
    window.setTimeout(() => {
      target.classList.remove('anchor-highlight');
    }, 900);
  }, delay);
}

export function App() {
  const path = pathWithoutBase();

  if (path === '/' && window.location.hash.startsWith('#/')) {
    const legacyRoute = window.location.hash.replace(/^#\/?/, '');

    if (
      legacyRoute === 'drafts' ||
      legacyRoute === 'function' ||
      legacyRoute === 'flow' ||
      legacyRoute === 'choosing-output'
    ) {
      window.history.replaceState({}, '', href(legacyRoute as Route));
    }
  }
  if (path === '/article/function') {
    window.history.replaceState({}, '', href('function'));
  }
  if (path === '/article/flow') {
    window.history.replaceState({}, '', href('flow'));
  }
  if (path === '/article/choosing-output') {
    window.history.replaceState({}, '', href('choosing-output'));
  }

  const [route, setRoute] = createSignal(routeFromLocation());
  const updateRoute = () => setRoute(routeFromLocation());
  const navigate = (event: MouseEvent) => {
    const target = event.target;
    const link = target instanceof Element ? target.closest('a') : null;

    if (!(link instanceof HTMLAnchorElement) || link.target || link.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    window.history.pushState({}, '', link.href);
    updateRoute();

    if (link.hash) {
      document.querySelector(link.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      highlightAnchor(link.hash, 350);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.addEventListener('popstate', updateRoute);
  document.addEventListener('click', navigate);
  createEffect(() => {
    route();

    if (window.location.hash) {
      requestAnimationFrame(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ block: 'start' });
        highlightAnchor(window.location.hash);
      });
    }
  });
  onCleanup(() => {
    window.removeEventListener('popstate', updateRoute);
    document.removeEventListener('click', navigate);
  });

  return (
    <main class="page">
      <Header />
      <Switch>
        <Match when={route() === 'drafts'}>
          <DraftPostsPage />
        </Match>
        <Match when={route() === 'function'}>
          <FunctionPage />
        </Match>
        <Match when={route() === 'flow'}>
          <FlowPage />
        </Match>
        <Match when={route() === 'choosing-output'}>
          <ChoosingOutputPage />
        </Match>
        <Match when={true}>
          <HomePage />
        </Match>
      </Switch>
    </main>
  );
}
