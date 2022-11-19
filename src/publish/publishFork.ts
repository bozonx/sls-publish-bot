import TgChat from '../apiTg/TgChat';
import {makePublishTaskTgArticle} from './makePublishTaskTgArticle';
import {PublishMenuState} from '../askUser/askPublishMenu';
import {SN_TYPES, SnType} from '../types/snTypes';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType';
import {makePublishTaskTgImage, makePublishTaskTgOnlyText} from './makePublishTaskTg';
import {NotionBlocks} from '../types/notion';
import {makePublishTaskTgPoll} from './makePublishTaskTgPoll';


export async function publishFork(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  pubType: PublicationType,
  postTexts: Record<SnType, string>,
  articleBlocks?: NotionBlocks,
  articleTitle?: string,
  tgTags?: string[],
  announcement?: string,
  // TODO: add prepared poll
) {
  for (const sn of state.sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        // article
        if (pubType === PUBLICATION_TYPES.article) {
          return makePublishTaskTgArticle(
            blogName,
            tgChat,
            state.selectedDate,
            state.selectedTime,
            articleBlocks!,
            articleTitle!,
            tgTags,
            announcement
          );
        }
        // poll
        else if (pubType === PUBLICATION_TYPES.poll) {
          return makePublishTaskTgPoll(
            state.selectedDate,
            state.selectedTime,
            {},
            blogName,
            tgChat,
          );
        }
        // only text
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
          PUBLICATION_TYPES.announcement,
        ].includes(pubType) && !state.mainImgUrl) {
          return makePublishTaskTgOnlyText(
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
          return makePublishTaskTgImage(
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
          throw new Error(`Photos and narrative not supported at the moment`);
        }
        else {
          throw new Error(`Unknown or unsupported publication type "${pubType}" of sn ${sn}`);
        }

        break;
      case SN_TYPES.site:
        throw new Error(`Publication to site isn't supported at the moment`);

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
