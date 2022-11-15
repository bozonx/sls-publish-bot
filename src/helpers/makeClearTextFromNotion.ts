import {NOTION_BLOCKS} from '../types/types';
import {clearMdText, prepareFooter, resolveTgFooter} from './helpers';
import {BlogTelegramConfig} from '../types/ExecConfig';
import {transformNotionToCleanText} from './transformNotionToCleanText';
import {makeTagsString} from '../lib/common';
import {SN_TYPES, SnType} from '../types/snTypes';
import {PublicationType} from '../types/publicationType';


export function makeClearTextFromNotion(
  sns: SnType[],
  pubType: PublicationType,
  useTgFooter: boolean,
  tgBlogConfig?: BlogTelegramConfig,
  textBlocks?: NOTION_BLOCKS,
  postText?: string,
  instaTags?: string[],
  tgTags?: string[],
): Record<SnType, string> {
  const result = {} as Record<SnType, string>;

  for (const sn of sns) {
    result[sn] = (textBlocks)
      ? transformNotionToCleanText(textBlocks)
      // TODO: sanitize
      : (postText || '');

    switch (sn) {
      case SN_TYPES.telegram:
        result[sn] += clearMdText(prepareFooter(
          resolveTgFooter(useTgFooter, pubType, tgBlogConfig),
          tgTags
        ));

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
