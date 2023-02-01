import TgChat from '../apiTg/TgChat.js';
import {makePublishTaskTgArticle} from './makePublishTaskTgArticle.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {makePublishTaskTgImage, makePublishTaskTgOnlyText, makePublishTaskTgPoll} from './makePublishTaskTg.js';
import {NotionBlocks} from '../types/notion.js';
import PollData from '../types/PollData.js';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import {MediaGroupItem} from '../types/types.js';


export async function publishFork(
  blogName: string,
  tgChat: TgChat,
  pubType: PublicationType,
  pubDate: string,
  pubTime: string,
  sns: SnType[],
  finalMediaGroup: MediaGroupItem[],
  postAsText: boolean,
  usePreview: boolean,
  pollData?: PollData,
  postTexts?: Partial<Record<SnType, string>>,
  articleBlocks?: NotionBlocks,
  articleTitle?: string,
) {
  for (const sn of sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        // article
        if (pubType === PUBLICATION_TYPES.article) {
          return makePublishTaskTgArticle(
            blogName,
            tgChat,
            pubDate,
            pubTime,
            articleBlocks!,
            articleTitle!,
            tgTags,
            announcement
          );
        }
        // poll
        else if (pubType === PUBLICATION_TYPES.poll) {
          return makePublishTaskTgPoll(
            blogName,
            tgChat,
            pubDate,
            pubTime,
            pollData!
          );
        }
        // only text
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
          PUBLICATION_TYPES.announcement,
        ].includes(pubType) && !state.mainImgUrl) {
          return makePublishTaskTgOnlyText(
            blogName,
            tgChat,
            pubDate,
            pubTime,
            postTexts[sn],
            usePreview,
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
            blogName,
            tgChat,
            pubDate,
            pubTime,
            state.mainImgUrl,
            postTexts[sn]
          );
        }
        // several photo
        else if ([
          PUBLICATION_TYPES.photos,
          PUBLICATION_TYPES.narrative,
        ].includes(pubType)) {

          // TODO: чо за хз всё же поддерживается

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
