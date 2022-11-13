import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
import {transformNotionToTelegramPostMd} from './transformNotionToTelegramPostMd';
import {NOTION_BLOCKS} from '../types/types';
import {clearMdText, makeTagsString} from './helpers';
import {BlogTelegramConfig} from '../types/ExecConfig';


export function makeClearTextFromNotion(
  sns: string[],
  pubType: PublicationTypes,
  tgBlogConfig?: BlogTelegramConfig,
  textBlocks?: NOTION_BLOCKS,
  postText?: string,
): Record<SnTypes, string> {
  const result = {} as Record<SnTypes, string>;

  for (const sn of sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        if (pubType === PUBLICATION_TYPES.article) {
          //result[sn] =
          //tgChat.app.config.blogs[blogName].sn.telegram?.articleFooter,
          // const cleanText = transformNotionToCleanText(textBlocks);
        }
        // post1000, post2000
        else if (pubType !== PUBLICATION_TYPES.poll) {
          if (textBlocks) {
            const cleanFooter = clearMdText(tgFooter || '');
            const tgLength = (cleanText + cleanFooter).length;
            //throw new Error(`No text blocks`);
            result[sn] = transformNotionToTelegramPostMd(textBlocks);
            // TODO: add footer
          }
          else if (postText) {
            // TODO: sanitize
            result[sn] = postText

          }

          // TODO: sanitize

          // TODO: add footer

          if (!result[sn]) delete result[sn];
        }
        // mem, photos, story, narrative, reels - может не быть
        // announcement

        break;
      case SN_TYPES.instagram:
        const instaTagsStr = makeTagsString(instaTags);
        const instaLength = (cleanText + '\n\n' + instaTagsStr).length;

        break;
      case SN_TYPES.site:
        break;
      // add others
      default:
        throw new Error(`Unknown sn ${sn}`);
    }
  }

  return result;
}
