import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkFrontmatterYaml from "remark-frontmatter-yaml";
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

export function parseMdFile(rawContent) {
  const file = remark()
    .use(remarkFrontmatter)
    .use(remarkFrontmatterYaml)
    .processSync(rawContent);

  return {
    frontmatter: file.data.frontmatter,
    content: file.value,
  };
}
