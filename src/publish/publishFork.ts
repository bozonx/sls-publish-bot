import ContentItem, {PUBLICATION_TYPES, SN_TYPES} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {publishPost1000Tg} from './publishPost1000Tg';
import TgChat from '../apiTg/TgChat';
import {publishPost2000Tg} from './publishPost2000Tg';
import {publishArticleTg} from './publishArticleTg';


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
            if (PUBLICATION_TYPES.post2000) {
              return publishPost2000Tg(
                contentItem,
                parsedPage,
                blogName,
                tgChat,
                allowFooter,
                correctedTime
              );
            }

            return publishPost1000Tg(
              contentItem,
              parsedPage,
              blogName,
              tgChat,
              allowPreview,
              allowFooter,
              correctedTime
            );
          }
          else {
            // TODO: тогда поидее надо делать объявление или чо ????
            // TODO: или заранее проверить
            // TODO: или если объявление то сразу его сделать pageContent??
          }

        // also - zen, instagram, site, tiktok, youtube
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


        // also - zen, instagram, site, tiktok, youtube
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
          // TODO: а что делать с ошибками ???
          if (!parsedPage) throw new Error(`No page to publish`);

          return publishArticleTg(
            contentItem,
            parsedPage,
            blogName,
            tgChat,
            correctedTime
          );

        // also - zen, instagram, site, tiktok, youtube
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
