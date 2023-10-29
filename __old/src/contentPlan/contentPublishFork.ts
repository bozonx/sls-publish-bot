import moment from 'moment';
import TgChat from '../apiTg/TgChat';
import {makePublishTaskTgArticle} from './makePublishTaskTgArticle';
import {SN_TYPES, SnType} from '../types/snTypes';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType';
import {registerTgTaskPoll, registerTgPost} from '../helpers/registerTgPost';
import {NotionBlocks} from '../types/notion';
import PollData from '../types/PollData';
import {MediaGroupItem} from '../types/types';
import {TgReplyBtnUrl} from '../types/TgReplyButton';
import {convertNotionToHtml} from '../helpers/convertNotionToHast';
import {makeBloggerEditPostUrl, makeIsoDateTimeStr} from '../helpers/helpers';


export async function contentPublishFork(
  blogName: string,
  tgChat: TgChat,
  pubType: PublicationType,
  pubIsoDate: string,
  pubTime: string,
  sns: SnType[],
  finalMediaGroup: MediaGroupItem[],
  postAsText: boolean,
  usePreview: boolean,
  pollData?: PollData,
  postTexts?: Partial<Record<SnType, string>>,
  articleBlocks?: NotionBlocks,
  articleTitle?: string,
  articleAnnounceMd?: string,
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string,
  sections?: string[],
) {
  for (const sn of sns) {
    switch (sn) {
      case SN_TYPES.telegram:
        // article
        if (pubType === PUBLICATION_TYPES.article) {
          await makePublishTaskTgArticle(
            blogName,
            tgChat,
            pubIsoDate,
            pubTime,
            articleBlocks!,
            articleTitle!,
            sections,
            articleAnnounceMd
          );
        }
        // poll
        else if (pubType === PUBLICATION_TYPES.poll) {
          await registerTgTaskPoll(
            blogName,
            tgChat,
            pubIsoDate,
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
            pubIsoDate,
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
        if ([
          PUBLICATION_TYPES.article,
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
        ].includes(pubType)) {
          if (!tgChat.app.blogs?.[blogName]?.sn?.blogger?.blogId) {
            throw new Error(`Can't find blogger.com blogId of ${blogName}`)
          }

          const blogId: string = tgChat.app.blogs[blogName].sn.blogger!.blogId
          const content = await convertNotionToHtml(
            articleBlocks!,

            // TODO: use google content image uploader

            (url: string) => tgChat.app.telegraPh.uploadImage(url)
            //async (url: string) => url
          )

          const data = await tgChat.app.bloggerCom.createPost(
            blogId,
            articleTitle!,
            content,
            moment(
              makeIsoDateTimeStr(pubIsoDate, pubTime, tgChat.app.appConfig.utcOffset)
            ).utcOffset(0).format(),
            sections,
          )

          await tgChat.reply(
            tgChat.app.i18n.message.bloggerComPostEditUrl + ': '
            + makeBloggerEditPostUrl(blogId, data.id!)
          )
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
