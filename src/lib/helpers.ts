import {COMMON_TAGS_MARK} from '$lib/constants'


export function makeTags(tags: string[] = [], common: string[] = []): string[] {
  const allTags: string[] = []

  for (const item of tags) {
    if (item === COMMON_TAGS_MARK) {
      for (const commonItem of common) {
        allTags.push(commonItem)
      }
    }
    else {
      allTags.push(item)
    }
  }

  return allTags
}

export function makeStrHashTags(tags: string[] = [], common: string[] = []): string {
  return makeTags(tags, common)
    .map((el: string) => `#${el}`)
    .join(' ')
}
