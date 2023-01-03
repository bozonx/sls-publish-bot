import TgChat from '../apiTg/TgChat';
import {addSimpleStep} from '../helpers/helpers';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {PageObjectResponse, PartialPageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {DB_DEFAULT_PAGE_SIZE} from '../apiNotion/constants';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd';
import {getFirstImageFromNotionBlocks} from '../publish/publishHelpers';
import {publishTgImage} from '../apiTg/publishTg';


const CONTENT_MARKER = 'content:';


export async function askCreative(blogName: string, tgChat: TgChat, onDone: (item: PageObjectResponse) => void) {
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

  const msg = tgChat.app.i18n.menu.selectCreatives;
  const buttons = [
    ...items.map((item, index) => {
      return [{
        text: (item as any).properties.name.title[0]?.plain_text,
        callback_data: CONTENT_MARKER + index,
      }];
    }),
    [
      BACK_BTN,
      CANCEL_BTN,
    ],
  ];

  await addSimpleStep(tgChat, msg, buttons,tgChat.asyncCb(async (queryData: string) => {
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
        await publishTgImage(tgChat.botChatId, image, tgChat, creativeStr, btnUrlResult);
      }
      else {
        await tgChat.reply(creativeStr, btnUrlResult && [[btnUrlResult]], !usePreview,true);
      }

      onDone(item);
    }
    else {
      throw new Error(`Unknown action`);
    }
  }));
}
