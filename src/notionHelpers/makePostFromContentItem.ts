import {NotionBlocks} from '../types/notion.js';
import {prepareFooter, resolveTgFooter} from '../helpers/helpers.js';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import ContentItem from '../types/ContentItem.js';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {transformNotionToCleanText} from '../helpers/transformNotionToCleanText.js';
import {clearMd} from '../helpers/clearMd.js';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost.js';


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

/**
 * Make full post texts for each social media.
 * It depends on publication type
 */
export function makePostFromContentItem(
  sns: SnType[],
  item: ContentItem,
  //state: ContentItemState,
  textBlocks?: NotionBlocks,
  footerTmplMd?: string
): Partial<Record<SnType, string>> {
  const result = {} as Record<SnType, string>;

  // TODO: для poll пусто
  // TODO: сделать тексты для каждой соц сети
  const resultTextHtml = (state.replacedHtmlText)
    ? state.replacedHtmlText
    // TODO: сформировать правильный текст поста взависимости от типа
    : 'text'
  // TODO: remake to HTML all
  // TODO: сделать сразу пост для статьи

  for (const sn of sns) {
    result[sn] = (textBlocks)
      ? transformNotionToTelegramPostMd(textBlocks)
      // TODO: sanitize
      : (postHtmlText || '');

    switch (sn) {
      case SN_TYPES.telegram:
        result[sn] += prepareFooter(
          resolveTgFooter(useTgFooter, pubType, tgBlogConfig),
          tgTags
        )

        break;
      case SN_TYPES.instagram:
        // add tags at the end of text
        result[sn] += '\n\n' + makeTagsString(instaTags);
        // transformNotionToInstagramPost(pageBlocks) + '\n\n'
        // + makeTagsString(state.instaTags)
        break;
    }

    if (!result[sn]) delete result[sn];
  }

  return result;
}
