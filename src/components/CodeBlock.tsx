import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import http from "highlight.js/lib/languages/http";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import typescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("http", http);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("typescript", typescript);

type CodeBlockProps = {
  ariaLabel: string;
  code: string;
  language: "bash" | "http" | "json" | "plaintext" | "typescript";
};

export function CodeBlock(props: CodeBlockProps) {
  const highlighted = () =>
    hljs.highlight(props.code.trimEnd(), {
      language: props.language,
      ignoreIllegals: true,
    }).value;

  return (
    <div class="code-card" aria-label={props.ariaLabel}>
      <pre>
        <code class={`language-${props.language}`} innerHTML={highlighted()} />
      </pre>
    </div>
  );
}
