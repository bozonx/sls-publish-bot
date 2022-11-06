import TgChat from '../apiTg/TgChat';
import {askStoryImage} from '../askUser/askStoryImage';
import {PhotoMessageEvent} from '../types/MessageEvent';
import {askStoryMenu, STORY_MENU_ACTION, StoryMenuAction} from '../askUser/askStoryMenu';
import {OK_BTN_CALLBACK} from '../types/constants';
import {askSelectTime} from '../askUser/askSelectTime';
import {askPubDate} from '../askUser/askPubDate';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {publishImageTg} from './publishHelpers';
import {askPostText} from '../askUser/askPostText';


export async function startPublishStory(blogName: string, tgChat: TgChat) {
  await askStoryImage(
    blogName,
    tgChat,
    tgChat.asyncCb(async (photoMsg: PhotoMessageEvent | string) => {
      const photoUrl = (typeof photoMsg === 'string') ? photoMsg : photoMsg.photo.fileId;
      const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;
      let caption = (footer) ? footer: undefined;
      // print result
      await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoUrl, {
        caption,
        parse_mode: tgChat.app.appConfig.telegram.parseMode,
      });

      await askMenu(blogName, tgChat, photoUrl, caption);
    }
  ));
}


async function askMenu(
  blogName: string,
  tgChat: TgChat,
  photoUrl: string,
  caption?: string,
  selectedDate?: string,
  selectedTime?: string,
  postText?: string,
  useFooter = true,
) {
  await askStoryMenu(blogName, tgChat, tgChat.asyncCb(async (action: StoryMenuAction | typeof OK_BTN_CALLBACK) => {
    switch (action) {
      case OK_BTN_CALLBACK:
        await publishImageTg(
          selectedDate!,
          selectedTime!,
          photoUrl,
          blogName,
          tgChat,
          caption
        );

        await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
        await tgChat.steps.cancel();

        break;
      case STORY_MENU_ACTION.FOOTER_SWITCH:
        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.selectedNoFooter
          + tgChat.app.i18n.onOff[Number(!useFooter)]
        );
        await askMenu(blogName, tgChat, photoUrl, caption, selectedDate, selectedTime, postText, !useFooter);

        break;
      case STORY_MENU_ACTION.ADD_TEXT:
        await askPostText(blogName, tgChat, tgChat.asyncCb(async (newPostText: string) => {

          // TODO: validate text ????

          await tgChat.reply(
            tgChat.app.i18n.menu.selectedPostText + newPostText
          );
          await askMenu(blogName, tgChat, photoUrl, caption, selectedDate, selectedTime, newPostText, !useFooter);
        }));

        break;
      case STORY_MENU_ACTION.DATE_SELECT:
        await askPubDate(tgChat, tgChat.asyncCb(async (newDate: string) => {
          await tgChat.reply(makeDateTimeMsg(tgChat, newDate, selectedTime));

          await askMenu(blogName, tgChat, photoUrl, caption, newDate, selectedTime, postText, useFooter);
        }));

        break;
      case STORY_MENU_ACTION.TIME_SELECT:
        await askSelectTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
          await tgChat.reply(makeDateTimeMsg(tgChat, selectedDate, newTime));

          await askMenu(blogName, tgChat, photoUrl, caption, selectedDate, newTime, postText, useFooter);
        }));

        break;
      default:
        throw new Error(`Unknown action`);
    }
  }), useFooter, selectedDate, selectedTime);
}


function makeDateTimeMsg(tgChat: TgChat, selectedDate?: string, selectedTime?: string): string {
  const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);

  if (selectedDate && selectedTime) {
    return tgChat.app.i18n.commonPhrases.selectedDateAndTime
      + `${selectedDate} ${selectedTime} ${utcOffset}`
  }
  else if (selectedDate && !selectedTime) {
    return tgChat.app.i18n.commonPhrases.selectedOnlyDate
      + `${selectedDate} ${utcOffset}`
  }
  else if (!selectedDate && selectedTime) {
    return tgChat.app.i18n.commonPhrases.selectedOnlyTime
      + `${selectedTime} ${utcOffset}`
  }
  else {
    return 'None';
  }
}
