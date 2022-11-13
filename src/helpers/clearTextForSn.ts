import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
import {NOTION_BLOCKS} from '../types/types';
import {clearMdText, makeTagsString} from './helpers';
import {BlogTelegramConfig} from '../types/ExecConfig';
import {transformNotionToCleanText} from './transformNotionToCleanText';


export function makeClearTextFromNotion(
  sns: SnTypes[],
  pubType: PublicationTypes,
  tgBlogConfig?: BlogTelegramConfig,
  textBlocks?: NOTION_BLOCKS,
  postText?: string,
): Record<SnTypes, string> {
  const result = {} as Record<SnTypes, string>;

  for (const sn of sns) {
    const cleanText: string = (textBlocks)
      ? transformNotionToCleanText(textBlocks)
      : (postText || '');

    result[sn] = cleanText;

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
            result[sn] = transformNotionToCleanText(textBlocks);
            // TODO: add footer
          }
          else if (postText) {
            // TODO: sanitize
            result[sn] = postText

          }

          // TODO: sanitize footer

          // TODO: add footer

        }
        // mem, photos, story, narrative, reels - может не быть
        // announcement

        break;
      case SN_TYPES.instagram:
        const instaTagsStr = makeTagsString(instaTags);
        const instaLength = (cleanText + '\n\n' + instaTagsStr).length;

        break;
      case SN_TYPES.site:
        result[sn] = cleanText;

        break;
      // add others
      default:
        throw new Error(`Unknown sn ${sn}`);
    }

    if (!result[sn]) delete result[sn];
  }

  return result;
}
