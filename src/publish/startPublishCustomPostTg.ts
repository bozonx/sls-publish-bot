import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';


export async function startPublishCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  footerTmpl?: string,
  forceDisablePreview = false,
  mediaRequired = false,
) {
  await askPostMedia(
    mediaRequired,
    blogName,
    tgChat,
    tgChat.asyncCb(async (photoIdOrUrl: string[], caption?: string) => {
      // TODO: photoIdOrUrl может быть пустой
      // TODO: use caption

      //const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;
      // TODO: выполнит шаблон c тэгами
      //let footerStr = (footerTmpl) ? footerTmpl: undefined;

      // print result
      // TODO: а если несколько картинок ???
      // await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoIdOrUrl[0], {
      //   caption: footerTmpl,
      //   parse_mode: tgChat.app.appConfig.telegram.parseMode,
      // });

      await askMenu(blogName, tgChat, photoIdOrUrl, forceDisablePreview, footerTmpl, caption);
    }));
}

async function askMenu(
  blogName: string,
  tgChat: TgChat,
  photoIdOrUrl: string[],
  forceDisablePreview: boolean,
  footerTmpl?: string,
  postText?: string,
  // these are variables for recursive call
  selectedDate?: string,
  selectedTime?: string,
  useFooter = true,
) {

}