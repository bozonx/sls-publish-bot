import BaseState from '../types/BaseState';
import {AppEvents, PublicationTypes} from '../types/consts';
import TgChat from '../tgApi/TgChat';


interface AskPublishState extends BaseState {
  channelId: number;
}

const CREATE_PREFIX = 'create_';


export async function askPublishType(channelId: number, tgChat: TgChat, onDone: (channelId: number) => void) {
  const initialState: AskPublishState = {
    channelId,
    messageId: -1,
    handlerIndex: -1,
  };

  await tgChat.addOrdinaryStep(initialState, async (state: AskPublishState) => {
    // print ask type message
    state.messageId = await printAskTypeMessage(state.channelId, tgChat);
    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (![
        MENU_MAKE_ARTICLE,
        MENU_MAKE_POST1000,
        MENU_MAKE_STORY
      ].includes(queryData)) return;

      this.startMakingRecord(state.channelId, queryData)
        .catch((e) => {throw e})
    });
  });
}

async function printAskTypeMessage(channelId: number, tgChat: TgChat): Promise<number> {
  return tgChat.reply(
    tgChat.app.i18n.menu.whatToDo,
    tgChat.app.config.channels[channelId].supportedTypes.map((type: number) => {
      switch (type) {
        case PublicationTypes.Article:
          return {
            text: tgChat.app.i18n.menu.btnCreateArticle,
            callback_data: MENU_MAKE_ARTICLE,
          }
        case PublicationTypes.Post1000:
          return {
            text: tgChat.app.i18n.menu.btnCreatePost1000,
            callback_data: MENU_MAKE_POST1000,
          }
        case PublicationTypes.Story:
          return {
            text: tgChat.app.i18n.menu.btnCreateStory,
            callback_data: MENU_MAKE_STORY,
          }
        default:
          throw new Error(`Unsupported publication type`)
      }
    })
  );
}