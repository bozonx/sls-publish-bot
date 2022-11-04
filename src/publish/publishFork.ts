import ContentItem, {PUBLICATION_TYPES, SN_TYPES} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {publishPostToTelegram} from './publishPostToTelegram';
import TgChat from '../apiTg/TgChat';


export async function publishFork(
  blogName: string,
  tgChat: TgChat,
  contentItem: ContentItem,
  allowPreview: boolean,
  allowFooter: boolean,
  correctedTime?: string,
  parsedPage?: RawPageContent,
) {
  // post like
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
  ].includes(contentItem.type)) {
    for (const sn of contentItem.sns) {
      switch (sn) {
        case SN_TYPES.telegram:
          if (parsedPage) {
            return publishPostToTelegram(contentItem, parsedPage, blogName, tgChat);
          }
          // TODO: тогда поидее надо делать объявление или чо ????
          // TODO: или заранее проверить
          // TODO: или если объявление то сразу его сделать pageContent??

        // case SN_TYPES.zen:
        //   break;
        // case SN_TYPES.instagram:
        //   break;
        // case SN_TYPES.site:
        //   break;
        // case SN_TYPES.tiktok:
        //   break;
        // // and youtube
        default:
          throw new Error(`Unknown or unsupported sn type ${sn}`);
      }
    }
  }
  // photos like
  else if ([
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ].includes(contentItem.type)) {
    // TODO: add
    for (const sn of contentItem.sns) {
      switch (sn) {
        case SN_TYPES.telegram:

        // case SN_TYPES.zen:
        //   break;
        // case SN_TYPES.instagram:
        //   break;
        // case SN_TYPES.site:
        //   break;
        // case SN_TYPES.tiktok:
        //   break;
        // // and youtube
        default:
          throw new Error(`Unknown or unsupported sn type ${sn}`);
      }
    }
  }
  // article
  else if (contentItem.type === PUBLICATION_TYPES.article) {
    // TODO: add
    for (const sn of contentItem.sns) {
      switch (sn) {
        case SN_TYPES.telegram:

        // case SN_TYPES.zen:
        //   break;
        // case SN_TYPES.instagram:
        //   break;
        // case SN_TYPES.site:
        //   break;
        // case SN_TYPES.tiktok:
        //   break;
        // // and youtube
        default:
          throw new Error(`Unknown or unsupported sn type ${sn}`);
      }
    }
  }
  // TODO: add announcement
  // TODO: add poll
  // TODO: add reels
  // TODO: add video

}
