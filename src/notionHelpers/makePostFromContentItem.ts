import {NotionBlocks} from '../types/notion.js';
import {prepareFooter} from '../helpers/helpers.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import ContentItem from '../types/ContentItem.js';
import {PUBLICATION_TYPES} from '../types/publicationType.js';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost.js';
import {transformNotionToTgHtml} from '../helpers/transformNotionToTgHtml.js';
import {commonMdToTgHtml} from '../helpers/commonMdToTgHtml.js';


/**
 * Make full post texts for each social media.
 * It depends on publication type
 */
export async function makePostFromContentItem(
  sns: SnType[],
  item: ContentItem,
  //state: ContentItemState,
  textBlocks?: NotionBlocks,
  footerTmplMd?: string,
  replacedHtmlText?: string
): Promise<Partial<Record<SnType, string>>> {
  const result = {} as Record<SnType, string>;

  // TODO: сделать сразу пост для статьи ???
  //       нужно же сформировать поидее уже после опубликованной статьи
  //       или может сюда воткнуть темплейт

  if (sns.includes(SN_TYPES.telegram)) {
    // it's for announcement
    if (replacedHtmlText) {
      result[SN_TYPES.telegram] = replacedHtmlText
    }
    else if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks) {
      result[SN_TYPES.telegram] = transformNotionToTgHtml(textBlocks)
    }

    if (result[SN_TYPES.telegram]) {
      result[SN_TYPES.telegram] += await commonMdToTgHtml(
        prepareFooter(footerTmplMd, item.tgTags)
      )
    }
  }

  if (sns.includes(SN_TYPES.instagram)) {
    // it's for announcement
    if (replacedHtmlText) result[SN_TYPES.instagram] = replacedHtmlText
    else if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks) {
      // TODO: а может лучше делать html ???
      result[SN_TYPES.instagram] = transformNotionToInstagramPost(textBlocks)
    }

    if (result[SN_TYPES.instagram]) {
      // TODO: add footer специально для инсты
      // add tags at the end of text
      result[SN_TYPES.instagram] +=  '\n\n' + makeTagsString(instaTags);
    }
  }

  if (sns.includes(SN_TYPES.site)) {
    // it's for announcement
    if (replacedHtmlText) result[SN_TYPES.site] = replacedHtmlText
    else if (![
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.poll,
    ].includes(item.type) && textBlocks) {
      result[SN_TYPES.telegram] = transformNotionToTgHtml(textBlocks)
    }

    if (result[SN_TYPES.site]) {
      // TODO: add footer специально для сайта
    }
  }

  return result
}
