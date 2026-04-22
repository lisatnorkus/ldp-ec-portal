// Minimal markdown renderer — handles only what we need for month_cards
// and similar content_md fields: **bold**, *italic*, and `- ` bullet
// lists. No external dependency. Enough for authored copy written by
// LDPEC staff; not a general-purpose Markdown engine.

import React from "react";

type Block =
  | { kind: "p"; inline: InlineNode[] }
  | { kind: "ul"; items: InlineNode[][] };

type InlineNode =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "italic"; value: string };

function parseInline(line: string): InlineNode[] {
  const out: InlineNode[] = [];
  let i = 0;
  let buf = "";
  const flush = () => {
    if (buf) {
      out.push({ kind: "text", value: buf });
      buf = "";
    }
  };
  while (i < line.length) {
    if (line[i] === "*" && line[i + 1] === "*") {
      const end = line.indexOf("**", i + 2);
      if (end > 0) {
        flush();
        out.push({ kind: "bold", value: line.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (line[i] === "*") {
      const end = line.indexOf("*", i + 1);
      if (end > 0) {
        flush();
        out.push({ kind: "italic", value: line.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buf += line[i];
    i++;
  }
  flush();
  return out;
}

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let buffer: string[] = [];
  let inList: InlineNode[][] | null = null;

  const flushParagraph = () => {
    if (buffer.length > 0) {
      const text = buffer.join(" ").trim();
      if (text) blocks.push({ kind: "p", inline: parseInline(text) });
      buffer = [];
    }
  };
  const flushList = () => {
    if (inList && inList.length > 0) {
      blocks.push({ kind: "ul", items: inList });
    }
    inList = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      if (!inList) inList = [];
      inList.push(parseInline(trimmed.slice(2)));
      continue;
    }
    if (trimmed === "") {
      flushParagraph();
      flushList();
      continue;
    }
    flushList();
    buffer.push(trimmed);
  }
  flushParagraph();
  flushList();
  return blocks;
}

function renderInline(nodes: InlineNode[], keyPrefix: string): React.ReactNode {
  return nodes.map((n, i) => {
    const key = `${keyPrefix}-${i}`;
    if (n.kind === "bold")
      return (
        <strong key={key} className="font-bold text-[var(--color-ldp-navy-900)]">
          {n.value}
        </strong>
      );
    if (n.kind === "italic")
      return (
        <em key={key} className="italic">
          {n.value}
        </em>
      );
    return <span key={key}>{n.value}</span>;
  });
}

export function MarkdownBody({
  text,
  className = "",
  paragraphClass = "",
  listClass = "",
}: {
  text: string;
  className?: string;
  paragraphClass?: string;
  listClass?: string;
}) {
  const blocks = parseBlocks(text);
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.kind === "p") {
          return (
            <p key={`p-${i}`} className={paragraphClass}>
              {renderInline(b.inline, `p-${i}`)}
            </p>
          );
        }
        return (
          <ul key={`ul-${i}`} className={listClass}>
            {b.items.map((item, j) => (
              <li key={`li-${i}-${j}`}>{renderInline(item, `li-${i}-${j}`)}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

// Strip markdown to plain text for previews where the raw markdown
// characters would show through (e.g., the grid-card preview on
// /this-month that uses .slice(0, 140)).
export function markdownToPlain(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
