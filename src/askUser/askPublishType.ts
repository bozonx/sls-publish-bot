import BaseState from '../types/BaseState';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  PUBLICATION_TYPES
} from '../types/consts';
import TgChat from '../tgApi/TgChat';
import {PublicationTypes} from '../types/PublicationTypes';
// import PublishArticle from '../publishTypes/PublishArticle';
// import PublishPost1000 from '../publishTypes/PublishPost1000';
// import PublishStory from '../publishTypes/PublishStory';


interface AskPublishState extends BaseState {
  channelId: number;
}

const CREATE_PREFIX = 'create_';


export async function askPublishType(channelId: number, tgChat: TgChat, onDone: (channelId: number) => void) {
  const state: AskPublishState = {
    channelId,
    messageId: -1,
    handlerIndex: -1,
  };

  await tgChat.addOrdinaryStep(state, async () => {
    // print ask type message
    state.messageId = await printAskTypeMessage(state.channelId, tgChat);
    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      // if (queryData === BACK_BTN_CALLBACK) {
      //   return tgChat.steps.back()
      //     .catch((e) => {throw e});
      // }
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

      startMakingRecord(
        state.channelId,
        queryData.slice(CREATE_PREFIX.length) as PublicationTypes,
        tgChat
      )
        .catch((e) => {throw e})
    });
  });
}

async function printAskTypeMessage(channelId: number, tgChat: TgChat): Promise<number> {
  return tgChat.reply(
    tgChat.app.i18n.menu.whatToDo,
    [
      ...tgChat.app.config.channels[channelId].supportedTypes.map((type: string) => {
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
      //BACK_BTN,
      CANCEL_BTN,
    ]
  );
}

export async function startMakingRecord(channelId: number, selectedType: PublicationTypes, tgChat: TgChat) {
  await tgChat.reply(
    tgChat.app.i18n.menu.selectedType
    + tgChat.app.i18n.publicationType[selectedType]
  );

  // switch (selectedType) {
  //   case CREATE_PREFIX + PUBLICATION_TYPES.article:
  //     const article = new PublishArticle(tgChat);
  //
  //     await article.start(channelId);
  //     break;
  //
  //   case CREATE_PREFIX + PUBLICATION_TYPES.post1000:
  //     const post1000 = new PublishPost1000(tgChat);
  //
  //     await post1000.start(channelId);
  //     break;
  //
  //   // TODO: add post 2000
  //
  //   case CREATE_PREFIX + PUBLICATION_TYPES.story:
  //     const story = new PublishStory(tgChat);
  //
  //     await story.start(channelId);
  //     break;
  //
  //   default:
  //     break;
  // }

}
