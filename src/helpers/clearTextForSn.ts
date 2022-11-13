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
  instaTags?: string[],
): Record<SnTypes, string> {
  const result = {} as Record<SnTypes, string>;

  for (const sn of sns) {
    const cleanText: string = (textBlocks)
      ? transformNotionToCleanText(textBlocks)
      : (postText || '');

    result[sn] = cleanText;

    switch (sn) {
      case SN_TYPES.telegram:

        // TODO: use - useTgFooter

        result[sn] += clearMdText(resolveTgFooter(pubType, tgBlogConfig));

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


function resolveTgFooter(pubType: PublicationTypes, tgBlogConfig?: BlogTelegramConfig): string | undefined {
  let footerStr: string | undefined;

  switch (pubType) {
    case PUBLICATION_TYPES.article:
      // TODO: свой футер !!!!
      //footerStr = tgBlogConfig?.storyFooter;
      //tgChat.app.config.blogs[blogName].sn.telegram?.articleFooter,
      // const cleanText = transformNotionToCleanText(textBlocks);
      break;
    case PUBLICATION_TYPES.mem:
      footerStr = tgBlogConfig?.memFooter;

      break;
    case PUBLICATION_TYPES.story:
      footerStr = tgBlogConfig?.storyFooter;

      break;
    case PUBLICATION_TYPES.reels:
      footerStr = tgBlogConfig?.reelFooter;

      break;
    case PUBLICATION_TYPES.poll:
      break;
    default:
      // post1000, post2000, announcement
      // ??? photos, narrative - наверное свои футеры
      footerStr = tgBlogConfig?.postFooter;

      break;
  }

  return footerStr;
}
