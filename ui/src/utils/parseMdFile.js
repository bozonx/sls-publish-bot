import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkFrontmatterYaml from "remark-frontmatter-yaml";

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
