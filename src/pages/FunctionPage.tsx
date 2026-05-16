import { ArticlePage } from "../components/ArticlePage";
import type { ArticleMenuItem } from "../components/ArticleMenu";
import { CodeBlock } from "../components/CodeBlock";
import { FunctionMap } from "../components/FunctionMap";
import githubRepoNavScreenshot from "../assets/github-repo-nav-source.png";

const articleMenuItems: ArticleMenuItem[] = [
  {
    href: "#real-function-needs",
    label: "Anatomy of a function",
    items: [
      { href: "#calling", label: "Invocation" },
      { href: "#catalog", label: "Discovery" },
      { href: "#schema", label: "Input" },
      { href: "#output-shape", label: "Output" },
      { href: "#reactive-information", label: "Reactivity" },
      { href: "#autocomplete", label: "Suggestions" },
      { href: "#partial-results", label: "Selection" },
      { href: "#visual-component", label: "Presentation" },
      { href: "#saved-metadata", label: "Form metadata" },
    ],
  },
  { href: "#larger-shape", label: "The larger shape" },
];

export function FunctionPage() {
  return (
    <ArticlePage
      current="function"
      title="Functions need a unified spec"
      lede="The point is not only to run code. It is to describe a capability once, then solve calling, discovery, UI, reactivity, and integration from the same source of truth."
      heroExtra={<FunctionMap />}
      menuItems={articleMenuItems}
    >
          <p>
            The simple picture of a function is input to output. A value enters, a rule runs, and a value leaves. That picture is useful,
            but it does not carry enough information for a real system.
          </p>
          <p>
            Once functions cross boundaries, every surrounding problem gets solved separately: the API shape, the CLI flags, the form
            fields, the catalog entry, the autocomplete source, the live updates, the renderer, and the permissions. The result is a
            pile of adapters that all describe the same operation in slightly different ways.
          </p>
          <p>
            fnforge starts from the opposite framing: we need a unified function spec. One description should say what the function does,
            what it accepts, what it returns, how it can be called, and how other systems can safely integrate with it.
          </p>
          <h2 id="real-function-needs">Anatomy of a function</h2>
          <p>
            Once a function crosses a boundary, the important questions are no longer only "what does the code do?" They become
            questions about calling, input, discovery, reactivity, selection, presentation, autocomplete, and saved metadata.
          </p>
          <h3 id="calling">Invocation</h3>
          <p>
            You write a function once. Then everyone wants to use it differently: from code, from a CLI, over HTTP, or through RPC or MCP.
          </p>
          <h4>CLI</h4>
          <CodeBlock ariaLabel="Calling a function from a CLI" language="bash" code="deploy-service --name api --env production --wait" />
          <h4>HTTP</h4>
          <CodeBlock
            ariaLabel="Calling a function over HTTP"
            language="http"
            code={`POST /deployments
{ "service": "api", "environment": "production", "wait": true }`}
          />
          <h4>Code</h4>
          <CodeBlock
            ariaLabel="Calling a function from code"
            language="typescript"
            code={`deployService({
  service: "api",
  environment: "production",
  wait: true
})`}
          />
          <h4>UI</h4>
          <p>
            In a UI, invocation happens through interaction: clicking a button, submitting a form, using a keyboard shortcut, or typing
            into a command palette.
          </p>
          <p>
            Many UI functions are tied to that interface and cannot be easily triggered programmatically without a person in the loop.
          </p>
          <h3 id="catalog">Discovery</h3>
          <p>
            A system needs a catalog of functions, not only documentation hidden in code. Tools should be able to ask, "what can this
            system do?"
          </p>
          <p>
            Other surfaces need their own way to reveal the same capabilities. A CLI can expose commands through <code>--help</code>,
            code may require opening files or generated types, and OpenAPI may require fetching a schema endpoint.
          </p>
          <h4>CLI</h4>
          <CodeBlock
            ariaLabel="CLI command discovery"
            language="bash"
            code={`fnforge --help

Commands:
  deploy-service
  create-release-tag
  get-repository-report`}
          />
          <h4>Code</h4>
          <CodeBlock
            ariaLabel="Code capability discovery"
            language="typescript"
            code={`import {
  deployService,
  createReleaseTag,
  getRepositoryReport
} from "@fnforge/functions";`}
          />
          <h4>OpenAPI</h4>
          <CodeBlock
            ariaLabel="OpenAPI capability discovery"
            language="http"
            code={`GET /openapi.json

paths:
  /deployments
  /release-tags
  /repository-report`}
          />
          <h4>UI</h4>
          <p>
            A UI can show what information is available in a system before you ask for it: lists, tabs, tables, filters, counters, and
            empty states all reveal the resources the system knows about.
          </p>
          <p>
            It can also show the commands that interact with those resources. Buttons, menus, command palettes, and forms make actions
            visible, and forms turn a command's arguments into fields you can inspect and fill in.
          </p>
          <figure class="annotated-ui">
            <img
              src={githubRepoNavScreenshot}
              alt="GitHub repository navigation showing visible feature tabs such as Issues, Pull requests, Discussions, Actions, Projects, Security, Insights, and Settings."
            />
            <span class="ui-highlight ui-highlight-issues" aria-hidden="true" />
            <span class="ui-highlight ui-highlight-pulls" aria-hidden="true" />
            <span class="ui-highlight ui-highlight-actions" aria-hidden="true" />
            <span class="ui-highlight ui-highlight-projects" aria-hidden="true" />
            <span class="ui-highlight ui-highlight-security" aria-hidden="true" />
            <figcaption>GitHub Docs screenshot, annotated: in a GUI, available features are often visible before you read any documentation.</figcaption>
          </figure>
          <h3 id="schema">Input</h3>
          <p>
            The function needs a schema: parameter names, types, required fields, defaults, examples, errors, permissions, and
            versioning.
          </p>
          <h4>CLI help</h4>
          <CodeBlock
            ariaLabel="CLI help introspection"
            language="plaintext"
            code={`deploy-service --help

Usage:
  deploy-service --name <service> --env <environment> [--wait]

Options:
  --name    Service name, required
  --env     Deployment environment, required
  --wait    Wait until the deployment finishes`}
          />
          <h4>OpenAPI</h4>
          <CodeBlock ariaLabel="OpenAPI endpoint introspection" language="http" code="GET /openapi.json" />
          <CodeBlock
            ariaLabel="OpenAPI schema introspection"
            language="json"
            code={`{
  "paths": {
    "/deployments": {
      "post": {
        "requestBody": {
          "schema": {
            "required": ["service", "environment"],
            "properties": {
              "service": { "type": "string" },
              "environment": { "enum": ["staging", "production"] },
              "wait": { "type": "boolean", "default": false }
            }
          }
        }
      }
    }
  }
}`}
          />
          <h4>TypeScript</h4>
          <CodeBlock
            ariaLabel="TypeScript type introspection"
            language="typescript"
            code={`type DeployServiceInput = {
  service: string;
  environment: "staging" | "production";
  wait?: boolean;
};`}
          />
          <p>
            Other systems describe the same input in their own way: JSON Schema, GraphQL SDL, Protocol Buffers, AsyncAPI, MCP tool
            schemas, SDK metadata, JSON-RPC and OpenRPC, ...
          </p>
          <h3 id="output-shape">Output</h3>
          <p>
            A function does not only need to return "something." Other systems need to know what shape comes back, which parts are
            structured data, which parts are display text, and whether the result can be transformed for different consumers.
          </p>
          <h4>CLI</h4>
          <CodeBlock
            ariaLabel="CLI output example"
            language="plaintext"
            code={`Deployment finished

Service: api
Environment: production
URL: https://api.example.com`}
          />
          <h4>JSON</h4>
          <CodeBlock
            ariaLabel="JSON output example"
            language="json"
            code={`{
  "service": "api",
  "environment": "production",
  "url": "https://api.example.com"
}`}
          />
          <h4>Table</h4>
          <CodeBlock
            ariaLabel="Table output example"
            language="plaintext"
            code={`SERVICE   ENVIRONMENT   STATUS   URL
api       production    ready    https://api.example.com`}
          />
          <h4>UI</h4>
          <p>
            A UI may render the same result as a status card, table row, chart, toast, or detail panel.
          </p>
          <h3 id="reactive-information">Reactivity</h3>
          <p>
            When we first write a function, we usually think of it as a one-time call. But reactivity depends on the consumer: in theory,
            any function result can be something another system wants to keep up to date. There is no shared standard for how that should
            work across transports.
          </p>
          <p>
            There are two concerns here: the tracking and publishing format, and the transport. A spec like ACP might define which events
            are emitted and how they are consumed. Another approach is to concentrate on the data structure itself, and stay agnostic
            about how that data structure is synchronized.
          </p>
          <h4>Function</h4>
          <CodeBlock
            ariaLabel="Reactive function example"
            language="typescript"
            code={`getDeploymentStatus({
  deploymentId: "dep_123"
})

returns

{
  "status": "building",
  "progress": 62,
  "updatedAt": "2026-05-11T14:04:18Z"
}`}
          />
          <h4>Tracking</h4>
          <p>
            The caller now needs to know what changed, when it changed, and whether the previous result is still valid. That can mean
            versions, cursors, timestamps, invalidation keys, or event names.
          </p>
          <CodeBlock
            ariaLabel="Tracking example"
            language="json"
            code={`{
  "resource": "deployment:dep_123",
  "version": 17,
  "changed": ["status", "progress"]
}`}
          />
          <h4>Transport</h4>
          <p>
            Then the same change needs to travel over some transport: polling, webhooks, server-sent events, WebSockets, a message queue,
            or an SDK subscription. Each one tends to invent a slightly different shape for the same update.
          </p>
          <CodeBlock
            ariaLabel="Transport examples"
            language="typescript"
            code={`poll("/deployments/dep_123/status");
subscribe("deployment:dep_123", onChange);
onWebhook("deployment.updated", onChange);`}
          />
          <h4>Stream</h4>
          <CodeBlock
            ariaLabel="Stream example"
            language="plaintext"
            code={`[12:04:01] Installing dependencies
[12:04:18] Building service
[12:04:44] Deployment ready`}
          />
          <h3 id="autocomplete">Suggestions</h3>
          <p>
            Some arguments are easy to type by hand, but many come from the system itself: repository names, branch names, users,
            environments, labels, projects, or any other domain value. A function spec can describe where those suggestions come from.
          </p>
          <h4>CLI</h4>
          <CodeBlock
            ariaLabel="CLI autocomplete example"
            language="bash"
            code={`deploy-service --env <Tab>

staging     production`}
          />
          <h4>TypeScript</h4>
          <CodeBlock
            ariaLabel="TypeScript autocomplete example"
            language="typescript"
            code={`deployService({
  environment: "production",
  branch: // editor suggests branches from the selected repo
})`}
          />
          <h4>OpenAPI</h4>
          <CodeBlock
            ariaLabel="OpenAPI autocomplete metadata example"
            language="json"
            code={`{
  "name": "branch",
  "x-suggest": {
    "operationId": "listBranches",
    "dependsOn": ["owner", "repo"]
  }
}`}
          />
          <h4>UI</h4>
          <p>
            In a UI, suggestions become autocomplete, searchable selects, recent values, and pickers that help people choose a valid
            value instead of guessing the exact string.
          </p>
          <h3 id="partial-results">Selection</h3>
          <p>
            If a report can return <code>health</code>, <code>license</code>, and <code>contributors</code>, the caller should be able
            to request only <code>health</code>. The other fields may be expensive or private.
          </p>
          <h3 id="visual-component">Presentation</h3>
          <p>
            Types can carry meaning. <code>RepositoryUrl</code> and <code>PolicyName</code> are both strings, but they should not
            necessarily use the same component.
          </p>
          <h3 id="saved-metadata">Form metadata</h3>
          <p>
            Forms often need labels, descriptions, placeholders, presets, validation messages, grouping, and layout hints. Those are
            part of the function experience too.
          </p>
          <h2 id="larger-shape">The larger shape</h2>
          <p>
            So a function is not only implementation, and it is not only a request/response shape. fnforge treats a function as a unified
            specification for a portable capability: typed, discoverable, callable, renderable, observable, and composable across
            transports.
          </p>
    </ArticlePage>
  );
}
