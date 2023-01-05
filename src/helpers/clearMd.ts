/**
 * Remove formatting of md from text to use it for collecting symbols count.
 */
export function clearMd(mdText?: string): string | undefined {
  if (!mdText) return

  // TODO: better to use unified
  // TODO: remove other formatting
  return mdText
    .replace(/\\/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
}
