import { ArticlePage } from '../components/ArticlePage';
import type { ArticleMenuItem } from '../components/ArticleMenu';
import { CodeBlock } from '../components/CodeBlock';

const articleMenuItems: ArticleMenuItem[] = [
  { href: '#output-schema', label: 'Output schema' },
  { href: '#format-layer', label: 'Format layer' },
  { href: '#generic-format', label: 'Generic format' },
  { href: '#semantic-metadata', label: 'Semantic metadata' },
  { href: '#specific-types', label: 'Specific types' },
  { href: '#default-formats', label: 'Default formats' },
  { href: '#register-format', label: 'Register format' },
  { href: '#automatic-mapping', label: 'Automatic mapping' },
  { href: '#client-renderers', label: 'Client renderers' },
  { href: '#any-table', label: 'Any table' },
];

export function ChoosingOutputPage() {
  return (
    <ArticlePage
      current="choosing-output"
      title="Choosing the output of a function"
      lede="The command owns the output shape. Formatters own how that shape is rendered."
      menuItems={articleMenuItems}
    >
      <p>You write a command. It returns the right data. At first, that feels finished.</p>
      <p>
        Then the terminal needs text, automation wants JSON, another command wants the same table, and the web client
        wants a Solid view. The design starts to bend: either the command grows rendering branches, or the developer
        creates several commands for the same capability.
      </p>
      <p>
        The user gets the other half of the pain. They know the view they want, but choosing it often means learning
        <code>jq</code>, <code>sed</code>, command-specific flags, or undocumented object shapes.
      </p>
      <p>
        The command still has one job: return structured data. The format layer should own how that data becomes text,
        JSON, a table, or a client-side view.
      </p>

      <h2 id="output-schema">Output schema</h2>
      <p>
        <code>definePowerCommand</code> already uses Zod to make inputs inspectable. The same contract should exist for
        the single value returned by the handler: add an <code>output</code> schema beside <code>params</code>.
      </p>
      <CodeBlock
        ariaLabel="Command definition with output schema"
        language="typescript"
        code={`const commandSearchResult = z.object({
  id: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  filePath: z.string(),
});

export const searchCommands = definePowerCommand({
  id: "$$command.command.search$$",
  label: "Search commands",
  params: z.object({
    query: z.string(),
  }),
  output: z.array(commandSearchResult),
  handler: async function searchCommands({ query }) {
    return searchCommandIndex(query);
  },
});`}
      />
      <p>
        The command now owns a real output contract. The runtime can validate returned values in development, docs can
        show the result shape, and every surface can ask for a rendering without changing what the command returns.
      </p>

      <h2 id="format-layer">Format layer</h2>
      <p>
        A command should return one structured output. <code>--format</code> should not ask the command to return
        something else. It should choose a formatter that takes that output type and produces another type.
      </p>
      <CodeBlock
        ariaLabel="commands run with selected formats"
        language="bash"
        code={`./goa commands:run commands:search "git"
./goa commands:run commands:search "git" --format json
./goa commands:run commands:search "git" --format table
./goa commands:run commands:search "git" --format string`}
      />
      <p>
        Without that layer, the same composition could still exist, but the user would have to wire it manually by
        piping one command into another formatter command.
      </p>
      <CodeBlock
        ariaLabel="Manual formatter piping"
        language="bash"
        code={`./goa commands:run commands:search "git" --format json \\
  | ./goa commands:run $$command.format.command-search-results-to-table$$ \\
  | ./goa commands:run $$command.format.table-to-string$$`}
      />
      <p>
        This keeps the boundary clean. The command returns an array of command search results. A JSON formatter can keep
        it as JSON. A table formatter can turn the array into a table model. A table-to-string formatter can render that
        table for a terminal.
      </p>
      <h2 id="generic-format">Generic format</h2>
      <p>
        If the command does not specify anything, goapower can use a generic format. That keeps basic commands cheap to
        write: return structured data first, let the runtime find a broad formatter later.
      </p>
      <CodeBlock
        ariaLabel="Command without default formats"
        language="typescript"
        code={`export const listBranches = definePowerCommand({
  id: "$$command.git.list-branches$$",
  params: z.object({
    repoPath: z.string(),
  }),
  output: z.array(
    z.object({
      name: z.string(),
      current: z.boolean(),
      remote: z.boolean(),
    }),
  ),
  handler: async function listBranches({ repoPath }) {
    return getBranches(repoPath);
  },
});

// No defaultFormats:
// the runtime can fall back to a generic array/object formatter.`}
      />

      <h2 id="semantic-metadata">Semantic metadata</h2>
      <p>
        A structural Zod schema says what shape a value has. Semantic metadata can say what the value means. That
        metadata can be added to any Zod type with <code>.meta(...)</code>, and a value can carry multiple
        <code>types</code>.
      </p>
      <CodeBlock
        ariaLabel="Generic URL type metadata"
        language="typescript"
        code={`const url = z.string().meta({
  types: ["$$type.url$$"],
});

export const urlToConsoleString = definePowerFormat({
  id: "$$command.format.url-to-console-string$$",
  params: z.object({
    value: url,
  }),
  output: z.string(),
  handler: ({ value }) => underline(value),
});`}
      />
      <p>
        The resolver can now use the semantic type, not only the string shape. A plain string can render as text. A
        string with <code>$$type.url$$</code> can render as an underlined terminal link.
      </p>
      <CodeBlock
        ariaLabel="URL format resolver"
        language="typescript"
        code={`resolveFormat(repositoryUrl, { format: "string" });

// schema shape: string
// schema types: ["$$type.url$$"]
// selected format: $$command.format.url-to-console-string$$`}
      />

      <h2 id="specific-types">Specific types</h2>
      <p>
        A value can also carry a more specific type. A repository URL is still a URL, but it can have its own rendering
        rule.
      </p>
      <CodeBlock
        ariaLabel="Repository URL semantic metadata"
        language="typescript"
        code={`const repositoryUrl = z.string().meta({
  types: ["$$type.repository-url$$", "$$type.url$$"],
});

export const repositoryUrlToConsoleString = definePowerFormat({
  id: "$$command.format.repository-url-to-console-string$$",
  params: z.object({
    value: repositoryUrl,
  }),
  output: z.string(),
  handler: ({ value }) => color(underline(value), "cyan"),
});`}
      />
      <p>
        When both formats can apply, the more specific semantic type should win. The exact selection rule can come
        later, but the resolver has enough information to prefer repository URL formatting over generic URL formatting.
      </p>
      <CodeBlock
        ariaLabel="Specific URL format resolver"
        language="typescript"
        code={`resolveFormat(repositoryUrl, { format: "string" });

// schema shape: string
// schema types: ["$$type.repository-url$$", "$$type.url$$"]
// selected format: $$command.format.repository-url-to-console-string$$
// fallback candidate: $$command.format.url-to-console-string$$`}
      />

      <h2 id="default-formats">Default formats</h2>
      <p>
        When a command wants to steer that choice, it can list its default formats with <code>defaultFormats</code>.
        This is not an exhaustive list of every possible formatter. It is the command author's hint for useful defaults.
      </p>
      <CodeBlock
        ariaLabel="Command definition with default formats"
        language="typescript"
        code={`export const searchCommands = definePowerCommand({
  id: "$$command.command.search$$",
  params: z.object({
    query: z.string(),
  }),
  output: z.array(commandSearchResult),
  defaultFormats: [
    "$$command.format.command-search-results-to-table$$",
    "$$command.format.json$$",
  ],
  handler: async function searchCommands({ query }) {
    return searchCommandIndex(query);
  },
});`}
      />
      <p>
        The selection rule can come later. For now, <code>defaultFormats</code> only says which registered formats
        should be considered first when the caller did not request a specific format.
      </p>

      <h2 id="register-format">Register format</h2>
      <p>
        A format can be defined with <code>definePowerFormat(...)</code>. Internally, that can call
        <code>definePowerCommand(...)</code>, because a format is still a typed function: it takes one type and returns
        another type.
      </p>
      <CodeBlock
        ariaLabel="Registering a format command"
        language="typescript"
        code={`const table = z.object({
  columns: z.array(z.object({ id: z.string(), label: z.string() })),
  rows: z.array(z.record(z.string(), z.unknown())),
});

export const tableToStringFormat = definePowerFormat({
  id: "$$command.format.table-to-string$$",
  label: "Format table as string",
  params: z.object({
    value: table,
  }),
  output: z.string(),
  handler: ({ value }) => renderTable(value),
});`}
      />
      <p>
        I looked for a doc that explains the <code>$$...$$</code> id convention and did not find one. I found many
        command ids using the pattern, so the examples here follow that existing convention without claiming a stricter
        rule than the codebase documents.
      </p>

      <h2 id="automatic-mapping">Automatic mapping</h2>
      <p>
        The interesting part is the mapping. A command should not need to know every format that can render its output.
        The runtime can use the command output schema, the registered format input schemas, and a small type registry to
        find compatible format chains.
      </p>
      <CodeBlock
        ariaLabel="Automatic format mapping"
        language="typescript"
        code={`export const arrayToTableFormat = definePowerFormat({
  id: "$$command.format.array-to-table$$",
  params: z.object({
    value: z.array(z.record(z.string(), z.unknown())),
  }),
  output: table,
  handler: ({ value }) => inferTable(value),
});

export const tableToStringFormat = definePowerFormat({
  id: "$$command.format.table-to-string$$",
  params: z.object({ value: table }),
  output: z.string(),
  handler: ({ value }) => renderTable(value),
});`}
      />
      <p>
        If <code>commands:search</code> returns an array of objects and the user asks for <code>--format string</code>,
        the runtime could discover a route: array of objects to table, then table to string. That gives goapower generic
        views without asking every command to implement terminal rendering.
      </p>
      <p>
        This also keeps room for specialized formats. A command can return a structured domain object, and a later
        module can register a formatter for that type without changing the command.
      </p>
      <CodeBlock
        ariaLabel="Possible format resolution"
        language="typescript"
        code={`runCommand("commands:search", { query: "git" }, { format: "string" });

// command output: CommandSearchResult[]
// compatible chain:
//   $$command.format.array-to-table$$
//   $$command.format.table-to-string$$
// final output: string`}
      />

      <h2 id="client-renderers">Client renderers</h2>
      <p>
        A Solid renderer, React renderer, or any client-side renderer can use the same model. There does not need to be
        a <code>target</code> or <code>contexts</code> field. The kind of format is implicit in the format command's
        output.
      </p>
      <CodeBlock
        ariaLabel="Solid renderable format"
        language="typescript"
        code={`const solidView = z.custom<JSX.Element>().meta({
  types: ["$$type.solid-view$$"],
});

export const commandSearchResultsToSolid = definePowerFormat({
  id: "$$command.format.command-search-results-to-solid$$",
  params: z.object({
    value: z.array(commandSearchResult),
  }),
  output: solidView,
  handler: ({ value }) => <CommandSearchResultsTable rows={value} />,
});`}
      />
      <p>
        A Solid client can consume formats whose output schema is <code>solidView</code>. A React client can consume
        formats whose output schema is <code>reactView</code>. The format id stays generic, and the output schema
        metadata carries the rendering nature.
      </p>
      <CodeBlock
        ariaLabel="React renderable format output"
        language="typescript"
        code={`const reactView = z.custom<React.ReactNode>().meta({
  types: ["$$type.react-view$$"],
});`}
      />
      <p>
        For client-side formats, the handler can render the component directly. The client can recognize
        <code>$$type.solid-view$$</code> or <code>$$type.react-view$$</code> when it chooses which format output it can
        consume.
      </p>

      <h2 id="any-table">Any table</h2>
      <p>
        A table renderer can accept <code>any</code>, but that should mean fallback, not first choice. It is useful for
        unknown data and fast exploration, but it should rank below formats that know the exact output type.
      </p>
      <CodeBlock
        ariaLabel="Any table fallback format"
        language="typescript"
        code={`export const anyToTableFormat = definePowerFormat({
  id: "$$command.format.any-to-table$$",
  label: "Format any value as table",
  params: z.object({
    value: z.any(),
  }),
  output: table,
  handler: ({ value }) => tableFromAny(value),
  priority: "fallback",
});`}
      />
      <p>
        The registry can treat <code>z.any()</code> as compatible with everything while assigning it a low specificity
        score later. If a command returns <code>CommandSearchResult[]</code>, a dedicated
        <code>CommandSearchResult[]</code>-to-table formatter should win. If no specific formatter exists, the generic
        table formatter can still inspect the value and produce a reasonable table.
      </p>
      <p>
        Because <code>definePowerFormat</code> owns the same id that the internal command uses, command defaults can
        point directly to a format command id such as <code>$$command.format.any-to-table$$</code>.
      </p>
      <p>
        That gives goapower a graceful path: precise renderers when the system understands the type, generic views when
        it does not, and no need for each command to hand-write a table renderer.
      </p>
    </ArticlePage>
  );
}
