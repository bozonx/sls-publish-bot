import TgChat from '../../apiTg/TgChat.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK, ChatEvents} from '../../types/constants.js';
import {PageObjectResponse, PartialPageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {DB_DEFAULT_PAGE_SIZE} from '../../apiNotion/constants.js';
import {loadPageBlocks} from '../../notionRequests/pageBlocks.js';
import {transformNotionToTelegramPostMd} from '../../helpers/transformNotionToTelegramPostMd.js';
import {getFirstImageFromNotionBlocks} from '../../publish/publishHelpers.js';
import {publishTgImage} from '../../apiTg/publishTg.js';
import BaseState from '../../types/BaseState.js';


const CONTENT_MARKER = 'content:';


export async function askCreative(blogName: string, tgChat: TgChat, onDone: (item: PageObjectResponse) => void) {
  await tgChat.addOrdinaryStep(tgChat.asyncCb(async (state: BaseState) => {
    let items: PageObjectResponse[];

    try {
      items = (await tgChat.app.notion.api.databases.query({
        database_id: tgChat.app.blogs[blogName].notion.creativeDbId,
        // TODO: надо выгребать вообще всё
        page_size: DB_DEFAULT_PAGE_SIZE,
      })).results as any;
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);

      return;
    }

    const msg = tgChat.app.i18n.menu.selectCreatives
    const buttons = [
      ...items.map((item, index) => {
        return [{
          text: (item as any).properties.name.title[0]?.plain_text,
          callback_data: CONTENT_MARKER + index,
        }]
      }),
      [
        BACK_BTN,
        CANCEL_BTN,
      ],
    ]

    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons, true))
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          else if (queryData.indexOf(CONTENT_MARKER) === 0) {
            const splat = queryData.split(':');
            const itemIndex = Number(splat[1]);
            const item = items[itemIndex];
            const pageContent = await loadPageBlocks(item.id, tgChat);
            const image = getFirstImageFromNotionBlocks(pageContent);
            const btnText = (item.properties?.btn_text as any).rich_text[0]?.plain_text;
            const btnUrl = (item.properties?.btn_url as any).url;
            const usePreview = (item.properties?.preview as any).checkbox;
            const creativeStr = transformNotionToTelegramPostMd(pageContent);
            const btnUrlResult = (btnText && btnUrl) ? {text: btnText, url: btnUrl} : undefined;

            if (image) {
              await publishTgImage(tgChat.app, tgChat.botChatId, image, creativeStr, btnUrlResult);
            }
            else {
              // TODO: будет HTML
              await tgChat.reply(creativeStr, btnUrlResult && [[btnUrlResult]], !usePreview,true);
            }

            onDone(item);
          }
          else {
            throw new Error(`Unknown action`);
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  }))
}
