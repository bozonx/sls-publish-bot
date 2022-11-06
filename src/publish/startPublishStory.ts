import TgChat from '../apiTg/TgChat';
import {askStoryImage} from '../askUser/askStoryImage';
import {PhotoMessageEvent} from '../types/MessageEvent';
import {askStoryMenu, STORY_MENU_ACTION, StoryMenuAction} from '../askUser/askStoryMenu';
import {OK_BTN_CALLBACK} from '../types/constants';
import {askSelectTime} from '../askUser/askSelectTime';


export async function startPublishStory(blogName: string, tgChat: TgChat) {
  // TODO: * + спрашиваем загрузить картинку
  //       * + проверяем что она только одна
  //       * + показываем что получилось
  //       * кнопка выкл футер
  //       * кнопка установка даты
  //       * кнопка установка времени

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

      await askMenu(blogName, tgChat);
    }
  ));
}


async function askMenu(
  blogName: string,
  tgChat: TgChat,
  selectedDate?: string,
  selectedTime?: string,
  useFooter = true,
) {
  await askStoryMenu(blogName, tgChat, tgChat.asyncCb(async (action: StoryMenuAction | typeof OK_BTN_CALLBACK) => {
    switch (action) {
      case OK_BTN_CALLBACK:
        if (!selectedDate) {
          return tgChat.reply(tgChat.app.i18n.errors.notSelectedPubDate);
        }
        else if (!selectedTime) {
          return tgChat.reply(tgChat.app.i18n.errors.notSelectedPubTime)
        }

        // TODO: add

        await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
        await tgChat.steps.cancel();

        break;
      case STORY_MENU_ACTION.FOOTER_SWITCH:
        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.selectedNoFooter
          + tgChat.app.i18n.onOff[Number(useFooter)]
        );
        await askMenu(blogName, tgChat, selectedDate, selectedTime, !useFooter);

        break;
      case STORY_MENU_ACTION.DATE_SELECT:

        // TODO: add

        await askMenu(blogName, tgChat, selectedDate, selectedTime, useFooter);

        break;
      case STORY_MENU_ACTION.TIME_SELECT:
        await askSelectTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
          await tgChat.reply(
            (selectedDate)
              ? tgChat.app.i18n.commonPhrases.selectedTimeMsg + selectedDate + ' ' + newTime
              : tgChat.app.i18n.commonPhrases.selectedOnlyTime + newTime
          );

          await askMenu(blogName, tgChat, selectedDate, newTime, useFooter);
        }));

        break;
      default:
        throw new Error(`Unknown action`);
    }
  }), useFooter, selectedDate, selectedTime);
}