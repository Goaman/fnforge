import { ArticlePage } from '../components/ArticlePage';
import type { ArticleMenuItem } from '../components/ArticleMenu';

const articleMenuItems: ArticleMenuItem[] = [
  { href: '#diagram', label: 'Diagram' },
  { href: '#reading-the-flow', label: 'Reading the flow' },
];

export function FlowPage() {
  return (
    <ArticlePage
      current="flow"
      title="server client flow"
      lede="A compact sketch of state and transport moving across the runtime boundary."
      menuItems={articleMenuItems}
    >
      <h2 id="diagram">Diagram</h2>
      <section class="diagram-wrap" aria-label="server client transport diagram">
        <svg viewBox="0 0 960 620" role="img" aria-labelledby="svg-title svg-desc">
          <title id="svg-title">Server client state and transport diagram</title>
          <desc id="svg-desc">
            Server state sits above server transport. A horizontal boundary divides state from transport. A dotted
            vertical boundary separates server from client. Transport flows bidirectionally between server and client
            transport. Client state can change locally through client transport and also receive server updates.
          </desc>
          <defs>
            <marker
              id="arrowTip"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path class="arrow-head" d="M 1 1 L 8 5 L 1 9" />
            </marker>
          </defs>

          <text class="zone-label" x="262" y="70" text-anchor="middle">
            server
          </text>
          <text class="zone-label" x="698" y="70" text-anchor="middle">
            client
          </text>

          <text class="lane-text" x="57" y="184">
            state
          </text>
          <text class="lane-text" x="57" y="441">
            transport
          </text>

          <line class="axis-line" x1="480" y1="92" x2="480" y2="563" />
          <line class="axis-line" x1="113" y1="310" x2="890" y2="310" />

          <rect class="node" x="158" y="160" width="207" height="86" rx="6" />
          <text class="node-title" x="262" y="199" text-anchor="middle">
            Server state
          </text>
          <text class="node-subtitle" x="262" y="224" text-anchor="middle">
            authoritative data
          </text>

          <rect class="node" x="595" y="160" width="207" height="86" rx="6" />
          <text class="node-title" x="699" y="199" text-anchor="middle">
            Client state
          </text>
          <text class="node-subtitle" x="699" y="224" text-anchor="middle">
            hydrated view
          </text>

          <rect class="node" x="158" y="406" width="207" height="86" rx="6" />
          <text class="node-title" x="262" y="445" text-anchor="middle">
            Server transport
          </text>
          <text class="node-subtitle" x="262" y="470" text-anchor="middle">
            serialize and send
          </text>

          <rect class="node" x="595" y="406" width="207" height="86" rx="6" />
          <text class="node-title" x="699" y="445" text-anchor="middle">
            Client transport
          </text>
          <text class="node-subtitle" x="699" y="470" text-anchor="middle">
            receive and apply
          </text>

          <line class="arrow-line" x1="262" y1="252" x2="262" y2="382" />
          <line class="arrow-line bidirectional" x1="371" y1="449" x2="580" y2="449" />
          <line class="arrow-line bidirectional" x1="699" y1="399" x2="699" y2="282" />

          <text class="lane-text" x="278" y="323">
            derive payload
          </text>
          <text class="lane-text" x="427" y="430">
            transport
          </text>
          <text class="lane-text" x="715" y="337">
            sync state
          </text>
        </svg>
      </section>
      <h2 id="reading-the-flow">Reading the flow</h2>
      <p>
        Server state is the authoritative source. Server transport derives a payload from that state, moves it across
        the boundary, and lets client transport update the client view.
      </p>
      <p>
        The client can also change local state through its transport layer. When the server sends new information, the
        client transport applies it back into the hydrated view.
      </p>
    </ArticlePage>
  );
}
