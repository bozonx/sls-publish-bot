import {NotionBlocks} from '../types/notion.js';
import {prepareFooter, resolveTgFooter} from '../helpers/helpers.js';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PublicationType} from '../types/publicationType.js';


export function makeTgHtmlFromNotion(
  sns: SnType[],
  pubType: PublicationType,
  useTgFooter: boolean,
  footerTmplMd?: string,
  textBlocks?: NotionBlocks,
  // replaced text for annoucement
  replacedHtmlText?: string,
  instaTags?: string[],
  tgTags?: string[],
): Partial<Record<SnType, string>> {
  const result = {} as Record<SnType, string>;

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
        );

        break;
      case SN_TYPES.instagram:
        // add tags at the end of text
        result[sn] += '\n\n' + makeTagsString(instaTags);

        break;
    }

    if (!result[sn]) delete result[sn];
  }

  return result;
}
