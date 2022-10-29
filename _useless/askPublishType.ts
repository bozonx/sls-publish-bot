import BaseState from '../src/types/BaseState';
import {
  AppEvents,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK, CREATE_PREFIX,
  PUBLICATION_TYPES
} from '../src/types/consts';
import TgChat from '../src/tgApi/TgChat';
import {PublicationTypes} from '../src/types/types';


interface AskPublishState extends BaseState {
  channelId: number;
}


export async function askPublishType(channelId: number, tgChat: TgChat, onDone: (pubType: PublicationTypes) => void) {
  const state: AskPublishState = {
    channelId,
    messageId: -1,
    handlerIndex: -1,
  };

  await tgChat.addOrdinaryStep(state, async () => {
    // print ask type message
    state.messageId = await printAskMessage(state.channelId, tgChat);
    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel()
          .catch((e) => {throw e});
      }
      else if (![
        CREATE_PREFIX + PUBLICATION_TYPES.article,
        CREATE_PREFIX + PUBLICATION_TYPES.post1000,
        CREATE_PREFIX + PUBLICATION_TYPES.post2000,
        CREATE_PREFIX + PUBLICATION_TYPES.story
      ].includes(queryData)) {
        return;
      }

      finish(queryData, tgChat, onDone)
        .catch((e) => {throw e});
    });
  });
}

async function printAskMessage(channelId: number, tgChat: TgChat): Promise<number> {
  return tgChat.reply(
    tgChat.app.i18n.menu.whatToDo,
    tgChat.app.config.channels[channelId].supportedTypes.map((type: string) => {
      switch (type) {
        case PUBLICATION_TYPES.article:
          return {
            text: tgChat.app.i18n.publicationType[PUBLICATION_TYPES.article],
            callback_data: CREATE_PREFIX + PUBLICATION_TYPES.article,
          }
        case PUBLICATION_TYPES.post1000:
          return {
            text: tgChat.app.i18n.publicationType[PUBLICATION_TYPES.post1000],
            callback_data: CREATE_PREFIX + PUBLICATION_TYPES.post1000,
          }
        case PUBLICATION_TYPES.post2000:
          return {
            text: tgChat.app.i18n.publicationType[PUBLICATION_TYPES.post2000],
            callback_data: CREATE_PREFIX + PUBLICATION_TYPES.post2000,
          }
        case PUBLICATION_TYPES.story:
          return {
            text: tgChat.app.i18n.publicationType[PUBLICATION_TYPES.story],
            callback_data: CREATE_PREFIX + PUBLICATION_TYPES.story,
          }
        default:
          throw new Error(`Unsupported publication type`)
      }
    }),
    [
      CANCEL_BTN,
    ]
  );
}

async function finish(
  queryData: string,
  tgChat: TgChat,
  onDone: (pubType: PublicationTypes) => void
) {
  const pubType = queryData.slice(CREATE_PREFIX.length) as PublicationTypes;

  await tgChat.reply(
    tgChat.app.i18n.menu.selectedType
    + tgChat.app.i18n.publicationType[pubType]
  );

  onDone(pubType);
}

