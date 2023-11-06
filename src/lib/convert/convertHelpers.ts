
/**
 * It makes string like this - ![alt text](image.jpg)
 */
export function makeMdImageString(src: string, altText: string = ''): string {
  return `![${altText}](${src})`
}
