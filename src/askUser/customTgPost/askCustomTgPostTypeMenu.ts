import {compactUndefined} from 'squidlet-lib';
import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep, compactButtons} from '../../helpers/helpers.js';
import {breakArray} from '../../lib/arrays.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';


export const CUSTOM_POST_MENU_ACTIONS = {
  POST1000: 'POST1000',
  POST2000: 'POST2000',
  MEM: 'MEM',
  PHOTOS: 'PHOTOS',
  STORY: 'STORY',
  POLL: 'POLL',
  REEL: 'REEL',
};


export async function askCustomTgPostTypeMenu(blogName: string, tgChat: TgChat, onDone: (action: string) => void) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      const blogSns = tgChat.app.blogs[blogName].sn;
      const supportedTypes = tgChat.app.blogs[blogName].sn.telegram?.supportedTypes || [];

      return [
        tgChat.app.i18n.menu.customPostTgMenu,
        compactButtons([
          ...breakArray(compactUndefined([
            supportedTypes.includes(PUBLICATION_TYPES.post1000) && {
              text: tgChat.app.i18n.menu.makePost1000,
              callback_data: CUSTOM_POST_MENU_ACTIONS.POST1000,
            } || undefined,
            supportedTypes.includes(PUBLICATION_TYPES.post2000) && {
              text: tgChat.app.i18n.menu.makePost2000,
              callback_data: CUSTOM_POST_MENU_ACTIONS.POST2000,
            } || undefined,
            supportedTypes.includes(PUBLICATION_TYPES.photos) && {
              text: tgChat.app.i18n.menu.makePhotos,
              callback_data: CUSTOM_POST_MENU_ACTIONS.PHOTOS,
            } || undefined,
            supportedTypes.includes(PUBLICATION_TYPES.mem) && {
              text: tgChat.app.i18n.menu.makeMem,
              callback_data: CUSTOM_POST_MENU_ACTIONS.MEM,
            } || undefined,
            supportedTypes.includes(PUBLICATION_TYPES.poll) && {
              text: tgChat.app.i18n.menu.makePollTg,
              callback_data: CUSTOM_POST_MENU_ACTIONS.POLL,
            } || undefined,
            blogSns.instagram && {
              text: tgChat.app.i18n.menu.makeStory,
              callback_data: CUSTOM_POST_MENU_ACTIONS.STORY,
            } || undefined,
            supportedTypes.includes(PUBLICATION_TYPES.reels) && {
              text: tgChat.app.i18n.menu.makeReel,
              callback_data: CUSTOM_POST_MENU_ACTIONS.REEL,
            } || undefined,
          ]), 2),
          [
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n),
          ],
        ])
      ]
    },
    async (queryData: string) => {
      if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel();
      }
      else if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back();
      }
      else if (Object.keys(CUSTOM_POST_MENU_ACTIONS).includes(queryData)) {
        return onDone(queryData);
      }
    }
  )
}
