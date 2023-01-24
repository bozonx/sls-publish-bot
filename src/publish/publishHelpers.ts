import {isUrl} from 'vfile/lib/minurl.shared.js';
import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {makeUtcOffsetStr} from '../helpers/helpers.js';
import {PRINT_FULL_DATE_FORMAT} from '../types/constants.js';
import ru from '../I18n/ru.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {NotionBlocks} from '../types/notion.js';
import {ROOT_LEVEL_BLOCKS} from '../notionRequests/pageBlocks.js';
import {publishTgImage, publishTgMediaGroup, publishTgText, publishTgVideo} from '../apiTg/publishTg.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';
import {MediaGroupItem} from '../types/types.js';
import {PollMessageEvent} from '../types/MessageEvent.js';
import {isValidUrl} from '../lib/common.js';


// TODO: review


export function getFirstImageFromNotionBlocks(blocks?: NotionBlocks): string | undefined {
  if (!blocks) return;

  for (const item of blocks[ROOT_LEVEL_BLOCKS]) {
    if (item.type === 'image') return (item.image as any).file.url;
  }
}

export function makeContentLengthString(
  i18n: typeof ru,
  clearTexts: Record<SnType, string>,
  instaTags?: string[],
  tgFooter?: string,
): string {
  let result = `${i18n.pageInfo.contentLength}: ${clearTexts[SN_TYPES.site].length}\n`;

  if (tgFooter) result += `${i18n.pageInfo.contentLengthWithTgFooter}: `
   + `${clearTexts[SN_TYPES.telegram].length}\n`;

  if (instaTags && instaTags.length) {
    result += `${i18n.pageInfo.contentLengthWithInstaTags}: `
        + `${clearTexts[SN_TYPES.instagram].length}\n`
      + `${i18n.pageInfo.instaTagsCount}: ` + (instaTags || []).length;
  }

  return result;
}





//https://telegra.ph/file/6a5b15e7eb4d7329ca7af.jpg
// TODO: добавить url картинки
// this.telegraPh.justSaveImage('https://telegra.ph/file/6a5b15e7eb4d7329ca7af.jpg')
//   .then((d) => console.log(1111, d))

export async function makePost2000Text(
  tgChat: TgChat,
  rawTextHtml: string,
  imgUrl?: string
): Promise<string> {
  // if no image then return just text
  if (!imgUrl) return rawTextHtml
  // if there is an image then put it to text
  // make image from file id if need
  const resolvedImgUrl = (isValidUrl(imgUrl))
    ? imgUrl
    : (await tgChat.app.tg.bot.telegram.getFileLink(imgUrl)).href
  // save image to telegraph
  const imgTelegraphUrl = await tgChat.app.telegraPh.justSaveImage(resolvedImgUrl)
  // put image to the text
  if (rawTextHtml.match(/\./)) {
    // put link to the first
    return rawTextHtml.replace(
      /\./,
      `<a href="${imgTelegraphUrl}">.</a>`
    )
  }
  // put link to the first letter
  // TODO: !!! сдеать через распарсивание html
  // return rawTextHtml.replace(
  //   /^([^\w\d]*)([\w\d])/,
  //   `$1<a href="${imgTelegraphUrl}">$2</a>`
  // )

  return rawTextHtml
}

// (async () => {
//   console.log(1111, await makePost2000Text(
//     {} as any,
//     '<p>some text,<p></p> another text,<p></p> and othe:</p>',
//     'https://ya.ru'
//   ))
// })()



export function makePublishInfoMessage(
  isoDate: string,
  resolvedTime: string,
  blogName: string,
  tgChat: TgChat,
): string {
  // TODO: отформатировать почеловечи
  return tgChat.app.i18n.message.prePublishInfo
    + tgChat.app.blogs[blogName].dispname + ', '
    // TODO: add sn
    + moment(isoDate).format(PRINT_FULL_DATE_FORMAT) + ' ' + resolvedTime + ' ' + makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
}

export async function printPost(
  chatId: number | string,
  tgChat: TgChat,
  usePreview: boolean,
  mediaGroup: MediaGroupItem[],
  urlBtn?: TgReplyBtnUrl,
  resultText = '',
) {
  if (mediaGroup.length > 1) {
    // media group
    await publishTgMediaGroup(
      tgChat.app,
      chatId,
      mediaGroup,
      resultText
    );
  }
  else if (mediaGroup.length) {
    // one image
    if (mediaGroup[0].type === 'video') {
      await publishTgVideo(
        tgChat.app,
        chatId,
        mediaGroup[0].fileId,
        resultText,
        urlBtn
      );
    }
    else if (mediaGroup[0].type === 'photo') {
      await publishTgImage(
        tgChat.app,
        chatId,
        mediaGroup[0].fileId,
        resultText,
        urlBtn
      );
    }
    else if (mediaGroup[0].type === 'photoUrl') {
      await publishTgImage(
        tgChat.app,
        chatId,
        mediaGroup[0].url,
        resultText,
        urlBtn
      );
    }
  }
  else {
    // no image or video
    if (!resultText) throw new Error(`No text`);

    await publishTgText(
      tgChat.app,
      chatId,
      resultText,
      usePreview,
      urlBtn
    );
  }
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
