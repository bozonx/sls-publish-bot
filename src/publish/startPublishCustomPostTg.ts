import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {PhotoMessageEvent} from '../types/MessageEvent';


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


        const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;
        let footerStr = (footer) ? footer: undefined;
        // print result
        await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoUrl, {
          caption: footerStr,
          parse_mode: tgChat.app.appConfig.telegram.parseMode,
        });

        await askMenu(blogName, tgChat, photoUrl, footerStr);
      }
    ));
}
