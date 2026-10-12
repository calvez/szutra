export function excerpt(markdown: string | undefined, maxLength = 160): string | undefined {
  const paragraph = (markdown ?? '')
    .replace(/<details[\s\S]*?<\/details>/g, '')
    .replace(/<[^>]+>/g, '')
    .split(/\n\s*\n/)
    .map((block) => block
      .replace(/⟦[^⟧]*⟧/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[\^[^\]]+\]/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/[*_`>#]/g, '')
      .replace(/\s+/g, ' ')
      .trim())
    .find((block) => block.length > 40 && !block.startsWith('[^'));

  if (!paragraph) {
    return undefined;
  }

  if (paragraph.length <= maxLength) {
    return paragraph;
  }

  return `${paragraph.slice(0, paragraph.lastIndexOf(' ', maxLength - 1))}…`;
}
