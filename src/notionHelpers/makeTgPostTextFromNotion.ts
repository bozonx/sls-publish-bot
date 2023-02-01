import {NotionBlocks} from '../types/notion.js';
import {prepareFooter, resolveTgFooter} from '../helpers/helpers.js';
import {BlogTelegramConfig} from '../types/BlogsConfig.js';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PublicationType} from '../types/publicationType.js';


export function makeTgPostTextFromNotion(
  sns: SnType[],
  pubType: PublicationType,
  useTgFooter: boolean,
  tgBlogConfig?: BlogTelegramConfig,
  textBlocks?: NotionBlocks,
  // TODO: а точно он html???
  postHtmlText?: string,
  instaTags?: string[],
  tgTags?: string[],
): Record<SnType, string> {
  const result = {} as Record<SnType, string>;

  // TODO: remake to HTML all

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
