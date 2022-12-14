import {NotionBlocks} from '../types/notion.js';
import {prepareFooter, resolveTgFooter} from './helpers.js';
import {BlogTelegramConfig} from '../types/BlogsConfig.js';
import {transformNotionToTelegramPostMd} from './transformNotionToTelegramPostMd.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PublicationType} from '../types/publicationType.js';


export function makeTgPostTextFromNotion(
  sns: SnType[],
  pubType: PublicationType,
  useTgFooter: boolean,
  tgBlogConfig?: BlogTelegramConfig,
  textBlocks?: NotionBlocks,
  postText?: string,
  instaTags?: string[],
  tgTags?: string[],
): Record<SnType, string> {
  const result = {} as Record<SnType, string>;

  for (const sn of sns) {
    result[sn] = (textBlocks)
      ? transformNotionToTelegramPostMd(textBlocks)
      // TODO: sanitize
      : (postText || '');

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
