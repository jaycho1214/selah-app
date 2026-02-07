/**
 * Converts HTML/plain text content to Lexical JSON format
 * Compatible with selah-web's Lexical editor structure
 * Supports spoiler syntax: ||text||
 */

interface LexicalTextNode {
  type: "text";
  text: string;
  format: number; // bitflags: 1=bold, 2=italic, 8=underline
  detail: number;
  mode: string;
  style: string;
  version: 1;
}

interface LexicalSpoilerNode {
  type: "spoiler";
  children: LexicalTextNode[];
  direction: "ltr" | "rtl" | null;
  format: string;
  indent: number;
  version: 1;
}

interface LexicalParagraphNode {
  type: "paragraph";
  children: (LexicalTextNode | LexicalMentionNode | LexicalSpoilerNode)[];
  direction: "ltr" | "rtl" | null;
  format: string;
  indent: number;
  version: 1;
}

interface LexicalMentionNode {
  type: "mention";
  userId: string;
  username: string;
  version: 1;
}

interface LexicalRootNode {
  type: "root";
  children: LexicalParagraphNode[];
  direction: "ltr" | "rtl" | null;
  format: string;
  indent: number;
  version: 1;
}

interface LexicalEditorState {
  root: LexicalRootNode;
}

type LexicalInlineNode =
  | LexicalTextNode
  | LexicalSpoilerNode
  | LexicalMentionNode;

/**
 * Simple HTML to Lexical converter
 * Handles basic formatting from tentap-editor output
 */
export function htmlToLexical(html: string): string {
  // For plain text (no HTML tags), create simple structure
  if (!html.includes("<")) {
    return JSON.stringify(createLexicalState(html));
  }

  // Parse HTML
  const paragraphs: LexicalParagraphNode[] = [];

  // Split by paragraph tags or line breaks
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  const matches: string[] = [];

  while ((match = pRegex.exec(html)) !== null) {
    matches.push(match[1]);
  }

  // If no <p> tags found, treat whole content as one paragraph
  if (matches.length === 0) {
    const cleaned = html.replace(/<[^>]+>/g, "").trim();
    if (cleaned) {
      matches.push(html);
    }
  }

  for (const content of matches) {
    const children = parseInlineContent(content);
    if (children.length > 0 || matches.length === 1) {
      paragraphs.push({
        type: "paragraph",
        children:
          children.length > 0
            ? children
            : [
                {
                  type: "text",
                  text: "",
                  format: 0,
                  detail: 0,
                  mode: "normal",
                  style: "",
                  version: 1,
                },
              ],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      });
    }
  }

  // Ensure at least one paragraph
  if (paragraphs.length === 0) {
    paragraphs.push({
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "",
          format: 0,
          detail: 0,
          mode: "normal",
          style: "",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    });
  }

  return JSON.stringify({
    root: {
      type: "root",
      children: paragraphs,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  });
}

function parseInlineContent(html: string): LexicalTextNode[] {
  const nodes: LexicalTextNode[] = [];

  // Simple regex-based parser for inline formatting
  // This handles nested tags like <strong><em>text</em></strong>

  let remaining = html;

  while (remaining.length > 0) {
    // Check for opening tags
    const tagMatch = remaining.match(/^<(strong|b|em|i|u|s)(\s[^>]*)?>/i);

    if (tagMatch) {
      const tagName = tagMatch[1].toLowerCase();
      const closeTag = new RegExp(`</${tagName}>`, "i");
      const closeMatch = remaining.match(closeTag);

      if (closeMatch && closeMatch.index !== undefined) {
        const innerContent = remaining.slice(
          tagMatch[0].length,
          closeMatch.index,
        );
        const format = getFormatFromTag(tagName);

        // Parse inner content recursively and apply format
        const innerNodes = parseInlineContent(innerContent);

        for (const node of innerNodes) {
          nodes.push({
            ...node,
            format: node.format | format,
          });
        }

        remaining = remaining.slice(closeMatch.index + closeMatch[0].length);
        continue;
      }
    }

    // Check for any other tag to skip
    const anyTagMatch = remaining.match(/^<[^>]+>/);
    if (anyTagMatch) {
      remaining = remaining.slice(anyTagMatch[0].length);
      continue;
    }

    // Extract text until next tag
    const textMatch = remaining.match(/^[^<]+/);
    if (textMatch) {
      const text = decodeHtmlEntities(textMatch[0]);
      if (text) {
        nodes.push({
          type: "text",
          text,
          format: 0,
          detail: 0,
          mode: "normal",
          style: "",
          version: 1,
        });
      }
      remaining = remaining.slice(textMatch[0].length);
      continue;
    }

    // Safety: skip one character to prevent infinite loop
    remaining = remaining.slice(1);
  }

  return nodes;
}

function getFormatFromTag(tag: string): number {
  switch (tag) {
    case "strong":
    case "b":
      return 1; // bold
    case "em":
    case "i":
      return 2; // italic
    case "u":
      return 8; // underline
    case "s":
      return 4; // strikethrough
    default:
      return 0;
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Parses plain text with spoiler syntax (||text||) into Lexical nodes
 */
function parseTextWithSpoilers(text: string): LexicalInlineNode[] {
  const nodes: LexicalInlineNode[] = [];
  const spoilerRegex = /\|\|([^|]+)\|\|/g;

  let lastIndex = 0;
  let match;

  while ((match = spoilerRegex.exec(text)) !== null) {
    // Add text before the spoiler
    if (match.index > lastIndex) {
      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText) {
        nodes.push({
          type: "text",
          text: beforeText,
          format: 0,
          detail: 0,
          mode: "normal",
          style: "",
          version: 1,
        });
      }
    }

    // Add spoiler node
    const spoilerText = match[1];
    nodes.push({
      type: "spoiler",
      children: [
        {
          type: "text",
          text: spoilerText,
          format: 0,
          detail: 0,
          mode: "normal",
          style: "",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last spoiler
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      nodes.push({
        type: "text",
        text: remainingText,
        format: 0,
        detail: 0,
        mode: "normal",
        style: "",
        version: 1,
      });
    }
  }

  // If no spoilers found, return single text node
  if (nodes.length === 0 && text) {
    nodes.push({
      type: "text",
      text,
      format: 0,
      detail: 0,
      mode: "normal",
      style: "",
      version: 1,
    });
  }

  return nodes;
}

/**
 * Creates a Lexical state from plain text
 * Supports spoiler syntax: ||text||
 */
export function createLexicalState(text: string): LexicalEditorState {
  const lines = text.split("\n");
  const paragraphs: LexicalParagraphNode[] = [];

  for (const line of lines) {
    // Parse each line for spoilers
    const children = parseTextWithSpoilers(line);

    paragraphs.push({
      type: "paragraph",
      children:
        children.length > 0
          ? children
          : [
              {
                type: "text",
                text: "",
                format: 0,
                detail: 0,
                mode: "normal",
                style: "",
                version: 1,
              },
            ],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    });
  }

  // Ensure at least one paragraph
  if (paragraphs.length === 0) {
    paragraphs.push({
      type: "paragraph",
      children: [
        {
          type: "text",
          text: "",
          format: 0,
          detail: 0,
          mode: "normal",
          style: "",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    });
  }

  return {
    root: {
      type: "root",
      children: paragraphs,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

/**
 * Checks if content is empty (only whitespace or empty paragraphs)
 */
export function isLexicalContentEmpty(lexicalJson: string): boolean {
  try {
    const state: LexicalEditorState = JSON.parse(lexicalJson);

    for (const paragraph of state.root.children) {
      for (const child of paragraph.children) {
        if (child.type === "text" && child.text.trim()) {
          return false;
        }
        if (child.type === "mention") {
          return false;
        }
        if (child.type === "spoiler") {
          return false;
        }
      }
    }

    return true;
  } catch {
    return !lexicalJson.trim();
  }
}
