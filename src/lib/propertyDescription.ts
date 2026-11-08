export type PropertyDescriptionBlock =
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; ordered: boolean; items: string[] };

const LIST_ITEM = /^([-*]|\d+[.)])\s+(.+)$/;

function inlineToPlain(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/(\*\*|__)([\s\S]+?)\1/g, "$2");
}

export function parsePropertyDescription(source: string): PropertyDescriptionBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: PropertyDescriptionBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: "paragraph", lines: paragraph });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push({ type: "list", ordered: list.ordered, items: list.items });
    list = null;
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const item = trimmed.match(LIST_ITEM);
    if (item) {
      flushParagraph();
      const ordered = /\d/.test(item[1]);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(item[2]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function propertyDescriptionPlainText(source: string): string {
  return parsePropertyDescription(source)
    .map((block) =>
      block.type === "paragraph"
        ? block.lines.map(inlineToPlain).join(" ")
        : block.items.map(inlineToPlain).join(" ")
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
