import { remark } from "remark";
// import strip from "strip-markdown";
import remarkRehype from "remark-rehype";
import rehypeExternalLinks from "rehype-external-links";
import html from "rehype-stringify";

// export function stripMd(mdContent) {
//   if (!mdContent) return mdContent;
//
//   return remark().use(strip).processSync(mdContent).toString();
// }

export function mdToHtml(mdContent) {
  if (!mdContent) return mdContent;

  return remark()
    .use(remarkRehype)
    .use(rehypeExternalLinks, { target: "_blank", rel: [] })
    .use(html)
    .processSync(mdContent)
    .toString();
}
