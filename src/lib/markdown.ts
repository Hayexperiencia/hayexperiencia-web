import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function markdownToHtml(md: string | null | undefined): string {
  if (!md) return "";
  return marked.parse(md, { async: false }) as string;
}
