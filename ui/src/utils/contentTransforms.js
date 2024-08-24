export function fullConvertArticleFromMdToHtml(
  contentMd,
  tmplMd,
  AUTHOR,
  AUTHOR_URL,
) {
  const resultMd = runTemplate(tmplMd, {
    CONTENT: contentMd?.trim(),
    AUTHOR,
    AUTHOR_URL,
  });

  return mdToHtml(resultMd);
}
