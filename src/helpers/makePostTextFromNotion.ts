import {PublicationTypes} from '../types/ContentItem';
import {NOTION_BLOCKS} from '../types/types';
import {prepareFooter, resolveTgFooter} from './helpers';
import {BlogTelegramConfig} from '../types/ExecConfig';
import {transformNotionToTelegramPostMd} from './transformNotionToTelegramPostMd';
import {makeTagsString} from '../lib/common';
import {SN_TYPES} from '../types/snTypes';


export function makePostTextFromNotion(
  sns: SnTypes[],
  pubType: PublicationTypes,
  useTgFooter: boolean,
  tgBlogConfig?: BlogTelegramConfig,
  textBlocks?: NOTION_BLOCKS,
  postText?: string,
  instaTags?: string[],
  tgTags?: string[],
): Record<SnTypes, string> {
  const result = {} as Record<SnTypes, string>;

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
