import TgChat from '../apiTg/TgChat.js';
import {makePublishTaskTgArticle} from '../publish/makePublishTaskTgArticle.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {registerTgTaskPoll, registerTgPost} from '../publish/registerTgPost.js';
import {NotionBlocks} from '../types/notion.js';
import PollData from '../types/PollData.js';
import {MediaGroupItem} from '../types/types.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';


export async function contentPublishFork(
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
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string,
  tgTags?: string[],
) {
  for (const sn of sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        // article
        if (pubType === PUBLICATION_TYPES.article) {
          await makePublishTaskTgArticle(
            blogName,
            tgChat,
            pubDate,
            pubTime,
            articleBlocks!,
            articleTitle!,
            tgTags,
            // TODO: где взять arcticleAnoucement ???
            //postTexts?.telegram
          );
        }
        // poll
        else if (pubType === PUBLICATION_TYPES.poll) {
          await registerTgTaskPoll(
            blogName,
            tgChat,
            pubDate,
            pubTime,
            pollData!,
            autoDeleteTgIsoDateTime,
            // TODO: add auto poll close
          );
        }
        else {
          // just post
          await registerTgPost(
            blogName,
            tgChat,
            pubDate,
            pubTime,
            postTexts?.telegram || '',
            postAsText,
            usePreview,
            finalMediaGroup,
            tgUrlBtn,
            autoDeleteTgIsoDateTime
          )
        }

        break;
      case SN_TYPES.blogger:
        if (pubType === PUBLICATION_TYPES.article) {
          tgChat.app
        }
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
        ].includes(pubType)) {
          // TODO: convert to article
          await tgChat.reply(`Publication to site isn't supported at the moment`)
          await tgChat.steps.back()
        }
        else {
          await tgChat.reply(`Blogger doesn't support ${pubType}`)
          await tgChat.steps.back()
        }

        break;
      case SN_TYPES.instagram:
        // just do nothing
        break;
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

// // only text
// else if ([
//   PUBLICATION_TYPES.post1000,
//   PUBLICATION_TYPES.post2000,
//   PUBLICATION_TYPES.announcement,
// ].includes(pubType) && !state.mainImgUrl) {
//   return registerTgTaskOnlyText(
//     blogName,
//     tgChat,
//     pubDate,
//     pubTime,
//     postTexts[sn],
//     usePreview,
//   );
// }
// // one photo
// else if ([
//   PUBLICATION_TYPES.post1000,
//   PUBLICATION_TYPES.mem,
//   PUBLICATION_TYPES.story,
//   PUBLICATION_TYPES.announcement,
//   PUBLICATION_TYPES.reels,
// ].includes(pubType) && state.mainImgUrl) {
//   return registerTgTaskImage(
//     blogName,
//     tgChat,
//     pubDate,
//     pubTime,
//     state.mainImgUrl,
//     postTexts[sn]
//   );
// }
// // several photo
// else if ([
//   PUBLICATION_TYPES.photos,
//   PUBLICATION_TYPES.narrative,
// ].includes(pubType)) {
//
//   // TODO: чо за хз всё же поддерживается
//
//   throw new Error(`Photos and narrative not supported at the moment`);
// }
// else {
//   throw new Error(`Unknown or unsupported publication type "${pubType}" of sn ${sn}`);
// }
