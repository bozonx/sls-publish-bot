import ContentItem, {PUBLICATION_TYPES, SN_TYPES} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {publishPost1000Tg} from './publishPost1000Tg';
import TgChat from '../apiTg/TgChat';
import {publishPost2000Tg} from './publishPost2000Tg';
import {publishArticleTg} from './publishArticleTg';
import {PublishMenuState} from '../askUser/askPublishMenu';


// TODO: распределение post1000 и post2000
//       картинка с описанием
//       * Если есть картинка и символов менее 1032
//       пост без картинки
//       * Если нет картинки и символов менее 2096
//       * Если есть картинка и символов более 1032 и менее 2096
//         + картинка загружается на telegra.ph

// TODO: add announcement
// TODO: add poll
// TODO: add reels
// TODO: add video


export async function publishFork(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  contentItem: ContentItem,
  parsedPage?: RawPageContent,
) {
  // post like
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.story,
  ].includes(contentItem.type)) {
    for (const sn of contentItem.sns) {
      switch (sn) {
        case SN_TYPES.telegram:
          if (parsedPage) {
            if (contentItem.type === PUBLICATION_TYPES.post2000) {
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

}
