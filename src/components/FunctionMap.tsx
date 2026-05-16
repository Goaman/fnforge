type FunctionMapBox = {
  id: string;
  href: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type FunctionMapAnchor = "top" | "right" | "bottom" | "left";

type FunctionMapConnector = {
  from: string;
  fromAnchor: FunctionMapAnchor;
  to: string;
  toAnchor: FunctionMapAnchor;
  bidirectional?: boolean;
  dotted?: boolean;
};

const functionMapBoxes: FunctionMapBox[] = [
  { id: "discovery", href: "#catalog", label: "Discovery", x: 44, y: 154, width: 126, height: 68 },
  { id: "ideal-function", href: "#real-function-needs", label: "Ideal function", x: 198, y: 28, width: 568, height: 340 },
  { id: "input", href: "#schema", label: "Input", x: 340, y: 132, width: 118, height: 68 },
  { id: "suggestions", href: "#autocomplete", label: "Suggestions", x: 220, y: 48, width: 138, height: 68 },
  { id: "selection", href: "#partial-results", label: "Selection", x: 402, y: 48, width: 138, height: 68 },
  { id: "invocation", href: "#calling", label: "Invocation", x: 333, y: 236, width: 132, height: 68 },
  { id: "output", href: "#output-shape", label: "Output", x: 608, y: 236, width: 118, height: 68 },
  { id: "reactivity", href: "#reactive-information", label: "Reactivity", x: 842, y: 96, width: 118, height: 68 },
  { id: "presentation", href: "#visual-component", label: "Presentation", x: 810, y: 226, width: 164, height: 68 },
];

const functionMapConnectors: FunctionMapConnector[] = [
  { from: "discovery", fromAnchor: "right", to: "ideal-function", toAnchor: "left" },
  { from: "suggestions", fromAnchor: "bottom", to: "input", toAnchor: "top" },
  { from: "selection", fromAnchor: "bottom", to: "input", toAnchor: "top" },
  { from: "input", fromAnchor: "bottom", to: "invocation", toAnchor: "top" },
  { from: "invocation", fromAnchor: "right", to: "output", toAnchor: "left" },
  { from: "output", fromAnchor: "right", to: "reactivity", toAnchor: "left" },
  { from: "output", fromAnchor: "right", to: "presentation", toAnchor: "left" },
  { from: "reactivity", fromAnchor: "bottom", to: "presentation", toAnchor: "top", dotted: true },
];

const functionMapBoxById = Object.fromEntries(functionMapBoxes.map((box) => [box.id, box]));

function functionMapAnchorPoint(box: FunctionMapBox, anchor: FunctionMapAnchor) {
  switch (anchor) {
    case "top":
      return { x: box.x + box.width / 2, y: box.y };
    case "right":
      return { x: box.x + box.width, y: box.y + box.height / 2 };
    case "bottom":
      return { x: box.x + box.width / 2, y: box.y + box.height };
    case "left":
      return { x: box.x, y: box.y + box.height / 2 };
  }
}

function functionMapConnectorPath(connector: FunctionMapConnector) {
  const from = functionMapBoxById[connector.from];
  const to = functionMapBoxById[connector.to];

  if (!from || !to) {
    return "";
  }

  const start = functionMapAnchorPoint(from, connector.fromAnchor);
  const end = functionMapAnchorPoint(to, connector.toAnchor);
  const midX = (start.x + end.x) / 2;

  if (connector.fromAnchor === "right" || connector.fromAnchor === "left") {
    return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
  }

  const midY = (start.y + end.y) / 2;
  return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
}

function goToFunctionMapSection(href: string) {
  window.location.hash = href;
}

export function FunctionMap() {
  return (
    <figure class="function-map" aria-label="Function anatomy map">
      <svg viewBox="28 28 954 366" role="img" aria-labelledby="function-map-title function-map-desc">
        <title id="function-map-title">Function anatomy cheatsheet</title>
        <desc id="function-map-desc">
          A unified function spec connects invocation, discovery, input, output, reactivity, suggestions, selection, presentation, and
          form metadata.
        </desc>
        <defs>
          <marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker id="map-arrow-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 10 0 L 0 5 L 10 10 z" />
          </marker>
        </defs>

        <rect class="map-core" x="198" y="28" width="568" height="340" rx="10" />
        <text class="map-core-title" x="482" y="384" text-anchor="middle">
          Ideal function
        </text>

        <g class="map-lines">
          {functionMapConnectors.map((connector) => (
            <path
              class={[connector.bidirectional ? "map-line-bidirectional" : "", connector.dotted ? "map-line-dotted" : ""].join(" ")}
              d={functionMapConnectorPath(connector)}
            />
          ))}
        </g>

        {functionMapBoxes.filter((box) => box.id !== "ideal-function").map((box) => (
          <g
            class="map-card"
            role="link"
            tabIndex={0}
            aria-label={`Jump to ${box.label}`}
            onClick={() => goToFunctionMapSection(box.href)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToFunctionMapSection(box.href);
              }
            }}
          >
            <rect x={box.x} y={box.y} width={box.width} height={box.height} rx="6" />
            <text x={box.x + box.width / 2} y={box.y + box.height / 2 + 5} text-anchor="middle">
              {box.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
