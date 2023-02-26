import TgChat from '../apiTg/TgChat.js';
import {makePublishTaskTgArticle} from './makePublishTaskTgArticle.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {registerTgTaskPoll, registerTgPost} from '../helpers/registerTgPost.js';
import {NotionBlocks} from '../types/notion.js';
import PollData from '../types/PollData.js';
import {MediaGroupItem} from '../types/types.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';
import {convertNotionToHtml} from '../helpers/convertNotionToHast.js';
import {makeBloggerEditPostUrl, makeIsoDateTimeStr} from '../helpers/helpers.js';


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
        if (pubType === PUBLICATION_TYPES.article) {
          if (!tgChat.app.blogs?.[blogName]?.sn?.blogger?.blogId) {
            throw new Error(`Can't find blogger.com blogId of ${blogName}`)
          }

          const blogId: string = tgChat.app.blogs[blogName].sn.blogger!.blogId

          // TODO: add image uploader
          // https://telegra.ph/file/f1b0e1c0dd8b8433fdfb5.jpg

          const content = await convertNotionToHtml(articleBlocks!, async (url: string) => url)

          // console.log(222,
          //   tgChat.app.blogs[blogName].sn.blogger!.blogId,
          //   articleTitle!,
          //   content,
          //   tgTags
          // )

          const data = await tgChat.app.bloggerCom.createPost(
            blogId,
            articleTitle!,
            content,

            // TODO: конвертнуть offset 0

            makeIsoDateTimeStr(pubIsoDate, pubTime, tgChat.app.appConfig.utcOffset),
            sections,
          )

          await tgChat.reply(
            tgChat.app.i18n.message.bloggerComPostEditUrl + ': '
            + makeBloggerEditPostUrl(blogId, data.id!)
          )
        }
        else if ([
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.post2000,
        ].includes(pubType)) {
          if (!tgChat.app.blogs?.[blogName]?.sn?.blogger?.blogId) {
            throw new Error(`Can't find blogger.com blogId of ${blogName}`)
          }

          console.log(1111,
            postTexts?.blogger,
            finalMediaGroup,
            articleBlocks,
            articleTitle,
            sections
          )

          const blogId: string = tgChat.app.blogs[blogName].sn.blogger!.blogId

          // TODO: add image uploader

          const content = await convertNotionToHtml(articleBlocks!, async (url: string) => url)
          const data = await tgChat.app.bloggerCom.createPost(
            blogId,
            articleTitle!,
            content,

            // TODO: конвертнуть offset 0

            makeIsoDateTimeStr(pubIsoDate, pubTime, tgChat.app.appConfig.utcOffset),
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
