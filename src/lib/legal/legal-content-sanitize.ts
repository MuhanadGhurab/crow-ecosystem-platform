function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip raw HTML tags before markdown rendering (no raw HTML passthrough). */
function stripRawHtml(markdown: string): string {
  return markdown.replace(/<[^>]*>/g, "");
}

/**
 * Minimal markdown → safe HTML for legal documents.
 * Escapes all input; only applies a small whitelist of markdown transforms.
 */
export function markdownToSafeHtml(markdown: string): string {
  const stripped = stripRawHtml(markdown);
  const lines = stripped.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      closeList();
      const level = trimmed.match(/^#+/)?.[0].length ?? 1;
      const tag = level <= 1 ? "h1" : level === 2 ? "h2" : "h3";
      const text = trimmed.replace(/^#{1,3}\s+/, "");
      html.push(`<${tag}>${inlineMarkdown(escapeHtml(text))}</${tag}>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      const item = trimmed.replace(/^[-*]\s+/, "");
      html.push(`<li>${inlineMarkdown(escapeHtml(item))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(escapeHtml(trimmed))}</p>`);
  }

  closeList();
  return html.join("\n");
}

function inlineMarkdown(escaped: string): string {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
    );
}
