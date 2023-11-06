import {fromMarkdown} from 'mdast-util-from-markdown'
import {toHast} from 'mdast-util-to-hast'
import {toHtml} from 'hast-util-to-html'


// TODO: проверит в какие тэги преобразуются
// TODO: strikethrough
// TODO: __underiline__

/**
 * Converts common MD to common html
 * ! Use **bold** instead of *bold*
 * ! It doesn't support ~strikethrough~ - use <s>strikethrough</s>, <del>strikethrough</del>
 * ! It doesn't support __underiline__ - use <u>underline</u>, <ins>underline</ins>
 */
export function convertCommonMdToCommonHtml(mdStr?: string): string | undefined {
  if (!mdStr) return

  let preSpaces = ''
  const preSpacesMatch = mdStr.match(/^(\s*)/)

  if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]

  const tree = fromMarkdown(mdStr, {
    // extensions: [gfm()],
    // mdastExtensions: [gfmFromMarkdown()],
  } as any)
  const hast = toHast(tree)
  const converted = toHtml(hast)

  return preSpaces + converted.replace(/\n$/, '')
}
