import type { ReactNode } from "react";
import { parsePropertyDescription } from "@/lib/propertyDescription";

type PropertyDescriptionBodyProps = {
  text: string;
};

const INLINE_MARKUP =
  /(\*\*|__)([\s\S]+?)\1|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderInline(text: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(INLINE_MARKUP)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    if (match[1]) {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${matchIndex}`}
          className="font-semibold text-gray-900"
        >
          {match[2]}
        </strong>
      );
    } else {
      nodes.push(
        <a
          key={`${keyPrefix}-a-${matchIndex}`}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {match[3]}
        </a>
      );
    }

    lastIndex = index + match[0].length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function PropertyDescriptionBody({ text }: PropertyDescriptionBodyProps) {
  const blocks = parsePropertyDescription(text);
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-4 text-gray-600 leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={
                block.ordered
                  ? "list-decimal space-y-1 pl-5"
                  : "list-disc space-y-1 pl-5"
              }
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item, `${index}-${itemIndex}`)}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={index}>
            {block.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {renderInline(line, `${index}-${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
