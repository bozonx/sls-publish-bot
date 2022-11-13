import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
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

// TODO: результирующий текст даже с футером. Включая статью
// TODO: для каждой соц сети же будет свой текст !!!!!

export async function publishFork(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  pubType: PublicationTypes,
  //postText: Record<SnTypes, string>,
  //articleText: Record<SnTypes, string>,
  //parsedPage?: RawPageContent,
) {
  for (const sn of state.sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        // article
        if (pubType === PUBLICATION_TYPES.article) {
          return publishArticleTg(
            contentItem,
            parsedPage,
            blogName,
            tgChat,
            correctedTime
          );
        }
        // poll
        else if (pubType === PUBLICATION_TYPES.poll) {

        }
        // only text
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
          PUBLICATION_TYPES.announcement,
        ].includes(pubType) && !state.mainImgUrl) {
          if (parsedPage) {
            if (pubType === PUBLICATION_TYPES.post2000) {
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

        }
        // one photo
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.mem,
          PUBLICATION_TYPES.story,
          PUBLICATION_TYPES.announcement,
          PUBLICATION_TYPES.reels,
        ].includes(pubType) && state.mainImgUrl) {

        }
        // several photo
        else if ([
          PUBLICATION_TYPES.photos,
          PUBLICATION_TYPES.narrative,
        ].includes(pubType)) {

        }
        else {
          throw new Error(`Unknown or unsupported publication type "${pubType}" of sn ${sn}`);
        }
        break;
      case SN_TYPES.site:
        break;
      // case SN_TYPES.instagram:
      //   break;
      // case SN_TYPES.zen:
      //   break;
      // case SN_TYPES.youtube:
      //   break;
      // case SN_TYPES.tiktok:
      //   break;
      default:
        throw new Error(`Unknown or unsupported sn type ${sn}`);
    }
  }

}
