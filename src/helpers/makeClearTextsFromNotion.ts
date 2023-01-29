import {NotionBlocks} from '../types/notion.js';
import {prepareFooter} from './helpers.js';
import {transformNotionToCleanText} from './transformNotionToCleanText.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PublicationType} from '../types/publicationType.js';


export function makeClearTextsFromNotion(
  sns: SnType[],
  pubType: PublicationType,
  useTgFooter: boolean,
  cleanTgFooterTmpl?: string,
  pageBlocks?: NotionBlocks,
  // TODO: а точно он html???
  //postHtmlText?: string,
  instaTags?: string[],
  tgTags?: string[],
): Partial<Record<SnType, string>> {
  const result: Partial<Record<SnType, string>> = {}

  for (const sn of sns) {
    result[sn] = (pageBlocks)
      ? transformNotionToCleanText(pageBlocks)
      // TODO: sanitize
      : (postHtmlText || '');
    // add footer
    switch (sn) {
      case SN_TYPES.telegram:
        if (useTgFooter) {
          result[sn] += prepareFooter(cleanTgFooterTmpl, tgTags)
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
