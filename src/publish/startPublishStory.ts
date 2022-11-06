import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {PhotoMessageEvent} from '../types/MessageEvent';
import {askCustomPostMenu, STORY_MENU_ACTION, StoryMenuAction} from '../askUser/askCustomPostMenu';
import {OK_BTN_CALLBACK} from '../types/constants';
import {askSelectTime} from '../askUser/askSelectTime';
import {askPubDate} from '../askUser/askPubDate';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {publishImageTg} from './publishHelpers';
import {askPostText} from '../askUser/askPostText';
import {compactUndefined} from '../lib/arrays';


export async function startPublishStory(blogName: string, tgChat: TgChat) {
  // await askPostMedia(
  //   blogName,
  //   tgChat,
  //   tgChat.asyncCb(async (photoMsg: PhotoMessageEvent | string) => {
  //     const photoUrl = (typeof photoMsg === 'string') ? photoMsg : photoMsg.photo.fileId;
  //     const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;
  //     let footerStr = (footer) ? footer: undefined;
  //     // print result
  //     await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoUrl, {
  //       caption: footerStr,
  //       parse_mode: tgChat.app.appConfig.telegram.parseMode,
  //     });
  //
  //     await askMenu(blogName, tgChat, photoUrl, footerStr);
  //   }
  // ));
}


async function askMenu(
  blogName: string,
  tgChat: TgChat,
  photoUrl: string,
  footerStr?: string,
  selectedDate?: string,
  selectedTime?: string,
  postText?: string,
  useFooter = true,
) {
  await askCustomPostMenu(blogName, tgChat, tgChat.asyncCb(async (action: StoryMenuAction | typeof OK_BTN_CALLBACK) => {
    switch (action) {
      case OK_BTN_CALLBACK:
        const resultText = compactUndefined(
          [postText, (useFooter) ? footerStr : undefined]
        ).join('') || undefined;

        await publishImageTg(
          selectedDate!,
          selectedTime!,
          photoUrl,
          blogName,
          tgChat,
          resultText
        );

        await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
        await tgChat.steps.cancel();

        break;
      case STORY_MENU_ACTION.FOOTER_SWITCH:
        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.selectedNoFooter
          + tgChat.app.i18n.onOff[Number(!useFooter)]
        );
        await askMenu(blogName, tgChat, photoUrl, footerStr, selectedDate, selectedTime, postText, !useFooter);

        break;
      case STORY_MENU_ACTION.ADD_TEXT:
        // await askPostText(blogName, tgChat, tgChat.asyncCb(async (newPostText: string) => {
        //
        //   // TODO: validate text ????
        //
        //   await tgChat.reply(
        //     tgChat.app.i18n.menu.selectedPostText + '\n' + newPostText
        //   );
        //   await askMenu(blogName, tgChat, photoUrl, footerStr, selectedDate, selectedTime, newPostText, useFooter);
        // }));

        break;
      case STORY_MENU_ACTION.DATE_SELECT:
        // await askPubDate(tgChat, tgChat.asyncCb(async (newDate: string) => {
        //   await tgChat.reply(makeDateTimeMsg(tgChat, newDate, selectedTime));
        //
        //   await askMenu(blogName, tgChat, photoUrl, footerStr, newDate, selectedTime, postText, useFooter);
        // }));

        break;
      case STORY_MENU_ACTION.TIME_SELECT:
        // await askSelectTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
        //   await tgChat.reply(makeDateTimeMsg(tgChat, selectedDate, newTime));
        //
        //   await askMenu(blogName, tgChat, photoUrl, footerStr, selectedDate, newTime, postText, useFooter);
        // }));

        break;
      default:
        throw new Error(`Unknown action`);
    }
  }), useFooter, selectedDate, selectedTime);
}
