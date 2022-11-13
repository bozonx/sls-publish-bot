import TgChat from '../apiTg/TgChat';
import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
import {publishArticleTg} from './publishArticleTg';
import {PublishMenuState} from '../askUser/askPublishMenu';
import {makeTaskTgPostImage, makeTaskTgPostOnlyText} from './publishHelpers';


// TODO: распределение post1000 и post2000
//       картинка с описанием
//       * Если есть картинка и символов менее 1032
//       пост без картинки
//       * Если нет картинки и символов менее 2096
//       * Если есть картинка и символов более 1032 и менее 2096
//         + картинка загружается на telegra.ph

export async function publishFork(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  pubType: PublicationTypes,
  postTexts: Record<SnTypes, string>,
  //articleText: Record<SnTypes, string>,
) {
  // const resolvedTime = (correctedTime) ? correctedTime : contentItem.time;

  for (const sn of state.sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        // article
        if (pubType === PUBLICATION_TYPES.article) {
          // return publishArticleTg(
          //   contentItem,
          //   parsedPage,
          //   blogName,
          //   tgChat,
          //   correctedTime
          // );
        }
        // poll
        else if (pubType === PUBLICATION_TYPES.poll) {

          // TODO: создать опрос полностью

        }
        // only text
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
          PUBLICATION_TYPES.announcement,
        ].includes(pubType) && !state.mainImgUrl) {
          return makeTaskTgPostOnlyText(
            state.selectedDate,
            state.selectedTime,
            postTexts[sn],
            blogName,
            tgChat,
            state.usePreview,
          );
        }
        // one photo
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.mem,
          PUBLICATION_TYPES.story,
          PUBLICATION_TYPES.announcement,
          PUBLICATION_TYPES.reels,
        ].includes(pubType) && state.mainImgUrl) {
          return makeTaskTgPostImage(
            state.selectedDate,
            state.selectedTime,
            state.mainImgUrl,
            blogName,
            tgChat,
            postTexts[sn]
          );
        }
        // several photo
        else if ([
          PUBLICATION_TYPES.photos,
          PUBLICATION_TYPES.narrative,
        ].includes(pubType)) {
          // TODO: what to do ????
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
