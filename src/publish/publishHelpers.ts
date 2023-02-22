import TgChat from '../apiTg/TgChat.js';
import {makeCleanTexts, makeHumanDateTimeStr} from '../helpers/helpers.js';
import ru from '../I18n/ru.js';
import {SnType} from '../types/snTypes.js';
import {NotionBlocks} from '../types/notion.js';
import {publishTgImage, publishTgMediaGroup, publishTgText, publishTgVideo} from '../apiTg/publishTg.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';
import {MediaGroupItem} from '../types/types.js';
import {PhotoData, PhotoUrlData, PollMessageEvent, VideoData} from '../types/MessageEvent.js';
import {makePost2000Text} from '../helpers/makePost2000.js';


export function getFirstImageFromNotionBlocks(blocks?: NotionBlocks): string | undefined {
  if (!blocks) return;

  for (const item of blocks) {
    if (item.type === 'image') return (item.image as any).file.url
  }
}

export function makeContentLengthDetails(
  i18n: typeof ru,
  useTgFooter: boolean,
  postTexts: Partial<Record<SnType, string>> = {},
  instaTags: string[] = []
): string {
  const cleanTexts = makeCleanTexts(postTexts) || {}
  const result: string[] = []

  if (cleanTexts.telegram) {
    if (useTgFooter) {
      result.push(
        `Telegram. ${i18n.pageInfo.contentLength} + ${i18n.commonPhrases.footer}: `
        + cleanTexts.telegram.length
      )
    }
    else {
      result.push(`Telegram. ${i18n.pageInfo.contentLength}: ${cleanTexts.telegram.length}`)
    }
  }

  if (cleanTexts.instagram) {
    if (instaTags.length) {
      result.push(
        `Instagram. ${i18n.pageInfo.contentLengthWithInstaTags}: ${cleanTexts.instagram.length}`
      )
      result.push(`${i18n.pageInfo.instaTagsCount}: ` + (instaTags).length)
    }
    else {
      result.push(
        `Instagram. ${i18n.pageInfo.contentLength}: ${cleanTexts.instagram.length}`
      )
    }
  }
  if (cleanTexts.zen) {
    result.push(
      `Zen. ${i18n.pageInfo.contentLength}: ${cleanTexts.zen.length}`
    )
  }
  // Blogger doesn't have a post. It will be an article

  return result.join('\n')
}

export function makePublishInfoMessage(
  isoDate: string,
  resolvedTime: string,
  blogName: string,
  tgChat: TgChat,
  sn: SnType
): string {
  return tgChat.app.i18n.message.prePublishInfo
    + tgChat.app.blogs[blogName].dispname + ', '
    + `${tgChat.app.i18n.commonPhrases.sn}: ${sn}, `
    + makeHumanDateTimeStr(isoDate, resolvedTime, tgChat.app.appConfig.utcOffset)
}

export async function printPost(
  chatId: number | string,
  tgChat: TgChat,
  usePreview: boolean,
  postAsText: boolean,
  mediaGroup: MediaGroupItem[],
  tgUrlBtn?: TgReplyBtnUrl,
  resultTextHtml = '',
) {
  if (!mediaGroup.length || postAsText) {
    // no image or video
    if (!resultTextHtml) throw new Error(`No text`);
    // post as only text
    const imgUrl: string | undefined = resolveImageUrl(mediaGroup)
    const post2000Txt = await makePost2000Text(tgChat, resultTextHtml, imgUrl);

    return await publishTgText(
      tgChat.app,
      chatId,
      post2000Txt,
      usePreview,
      tgUrlBtn
    );
  }
  else if (mediaGroup.length > 1) {
    // media group
    return await publishTgMediaGroup(
      tgChat.app,
      chatId,
      mediaGroup,
      resultTextHtml
    );
  }
  else if (!mediaGroup.length) {
    throw new Error(`Nothing to post`)
  }
  // else print one video
  else if ((mediaGroup[0] as any).type === 'video') {
    return await publishTgVideo(
      tgChat.app,
      chatId,
      (mediaGroup[0] as any).fileId,
      resultTextHtml,
      tgUrlBtn
    );
  }
  // else print one image
  return await publishTgImage(
    tgChat.app,
    chatId,
    (mediaGroup[0] as any).fileId || (mediaGroup[0] as any).url,
    resultTextHtml,
    tgUrlBtn
  );
}

export function resolveImageUrl(mediaGroup: (PhotoData | PhotoUrlData | VideoData)[]): string | undefined {
  if (!mediaGroup.length) return
  else if (mediaGroup[0].type === 'photo') return mediaGroup[0].fileId
  else if (mediaGroup[0].type === 'photoUrl') return mediaGroup[0].url
}

export function makePollInfo(message: PollMessageEvent, tgChat: TgChat): string {
  let result = tgChat.app.i18n.commonPhrases.type + message.poll.type + '\n'
    + tgChat.app.i18n.commonPhrases.isAnonymous
    + tgChat.app.i18n.yesNo[Number(message.poll.isAnonymous)] + '\n'
    + tgChat.app.i18n.commonPhrases.isMultipleAnswer
    + tgChat.app.i18n.yesNo[Number(message.poll.multipleAnswers)] + '\n'

  if (typeof message.poll.correctOptionId !== 'undefined') {
    result += tgChat.app.i18n.commonPhrases.quizAnswer + message.poll.correctOptionId
  }

  return result;
}
