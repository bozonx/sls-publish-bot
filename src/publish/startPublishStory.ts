import TgChat from '../apiTg/TgChat';
import {askStoryImage} from '../askUser/askStoryImage';
import {PhotoMessageEvent} from '../types/MessageEvent';
import {askStoryMenu, STORY_MENU_ACTION, StoryMenuAction} from '../askUser/askStoryMenu';


export async function startPublishStory(blogName: string, tgChat: TgChat) {
  // TODO: * + спрашиваем загрузить картинку
  //       * + проверяем что она только одна
  //       * + показываем что получилось
  //       * кнопка выкл футер
  //       * кнопка установка даты
  //       * кнопка установка времени
  let useFooter = true;
  let correctedTime: string | undefined;
  let correctedDate: string | undefined;


  await askStoryImage(
    blogName,
    tgChat,
    tgChat.asyncCb(async (photoMsg: PhotoMessageEvent | string) => {
      const photoUrl = (typeof photoMsg === 'string') ? photoMsg : photoMsg.photo.fileId;
      const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;
      let caption = (footer) ? footer: undefined;

      await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoUrl, {
        caption,
        parse_mode: tgChat.app.appConfig.telegram.parseMode,
      });

      await askStoryMenu(blogName, tgChat, (action: StoryMenuAction) => {
        if (action === STORY_MENU_ACTION.FOOTER_SWITCH) {
          useFooter = !useFooter;
        }
        else if (action === STORY_MENU_ACTION.DATE_SELECT) {
          // TODO: ask date
        }
        else if (action === STORY_MENU_ACTION.TIME_SELECT) {
          // TODO: ask time
        }
      }, useFooter, correctedDate, correctedTime);
      //console.log(1111, photoMsg)
    }
  ));
}
