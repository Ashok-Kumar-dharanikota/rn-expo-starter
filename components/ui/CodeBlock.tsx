import React from "react";

type Token = { text: string; className: string };

/** Minimal, dependency-free JSON tokenizer for syntax highlighting. */
function tokenizeJson(source: string): Token[][] {
  return source.split("\n").map((line) => {
    const tokens: Token[] = [];
    const regex =
      /("(?:\\.|[^"\\])*")(\s*:)?|(\btrue\b|\bfalse\b|\bnull\b)|(-?\d+(?:\.\d+)?)|([{}[\],])/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          text: line.slice(lastIndex, match.index),
          className: "text-[color:var(--code-punc)]",
        });
      }
      if (match[1] !== undefined) {
        if (match[2]) {
          tokens.push({
            text: match[1],
            className: "text-[color:var(--code-key)]",
          });
          tokens.push({
            text: match[2],
            className: "text-[color:var(--code-punc)]",
          });
        } else {
          tokens.push({
            text: match[1],
            className: "text-[color:var(--code-str)]",
          });
        }
      } else if (match[3] !== undefined) {
        tokens.push({
          text: match[3],
          className: "text-[color:var(--code-num)]",
        });
      } else if (match[4] !== undefined) {
        tokens.push({
          text: match[4],
          className: "text-[color:var(--code-bool)]",
        });
      } else if (match[5] !== undefined) {
        tokens.push({ text: match[5], className: "text-content-muted" });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      tokens.push({
        text: line.slice(lastIndex),
        className: "text-[color:var(--code-punc)]",
      });
    }
    return tokens;
  });
}

interface CodeBlockProps {
  code: string;
  language: "json" | "tree";
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
}: CodeBlockProps) {
  const lines =
    language === "json"
      ? tokenizeJson(code)
      : code
          .split("\n")
          .map((line) => [{ text: line, className: treeClass(line) }]);

  return (
    <pre className="overflow-x-auto font-mono text-[12.5px] leading-[1.7]">
      <code className="block">
        {lines.map((tokens, i) => (
          <div key={i} className="flex">
            {showLineNumbers && (
              <span className="mr-4 inline-block w-6 select-none text-right text-content-faint">
                {i + 1}
              </span>
            )}
            <span className="whitespace-pre">
              {tokens.map((t, j) => (
                <span key={j} className={t.className}>
                  {t.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
}

function treeClass(line: string): string {
  if (line.includes("/") && !line.includes(".")) return "text-accent";
  if (/\.(tsx?|json|js)$/.test(line.trim())) return "text-content";
  return "text-content-muted";
}
