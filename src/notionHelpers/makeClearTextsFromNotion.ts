import {NotionBlocks} from '../types/notion.js';
import {prepareFooter} from '../helpers/helpers.js';
import {transformNotionToCleanText} from '../helpers/transformNotionToCleanText.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {clearMd} from '../helpers/clearMd.js';


export async function makeClearTextsFromNotion(
  sns: SnType[],
  pubType: PublicationType,
  useTgFooter: boolean,
  footerTmplMd?: string,
  pageBlocks?: NotionBlocks,
  articleHeader?: string,
  instaTags?: string[],
  tgTags?: string[],
): Promise<Partial<Record<SnType, string>>> {
  const result: Partial<Record<SnType, string>> = {}

  for (const sn of sns) {
    result[sn] = ''

    if (pageBlocks) {
      if (pubType === PUBLICATION_TYPES.article) {
        result[sn] = articleHeader + '\n\n'
      }

      result[sn] += transformNotionToCleanText(pageBlocks)
    }
    // add footer
    switch (sn) {
      case SN_TYPES.telegram:
        if (useTgFooter) {
          result[sn] += await clearMd(prepareFooter(footerTmplMd, tgTags)) || ''
        }

        break
      case SN_TYPES.instagram:
        // add tags at the end of text
        result[sn] += '\n\n' + makeTagsString(instaTags)

        break
    }
    // if no text then just remove the node
    if (!result[sn]) delete result[sn];
  }

  return result
}
