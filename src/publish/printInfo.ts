import TgChat from '../apiTg/TgChat.js';
import ContentItem from '../types/ContentItem.js';
import RawPageContent from '../types/PageContent.js';
import {makeHumanDateTimeStr, prepareFooter} from '../helpers/helpers.js';
import {makeContentPlanItemDetails} from './parseContent.js';
import {makePageDetailsMsg} from './parsePage.js';
import {makeContentLengthString} from './publishHelpers.js';
import {PublishMenuState} from '../askUser/publishContentPlan/askPublishMenu.js';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';


export async function printItemDetails(
  blogName: string,
  tgChat: TgChat,
  clearTexts: Record<SnType, string>,
  resolvedSns: SnType[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent
) {
  const footerStr = prepareFooter(
    tgChat.app.blogs[blogName].sn.telegram?.postFooter,
    parsedPage?.tgTags,
    true
  );
  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    );
  }

  // make content plan info details message
  const contentInfoMsg = makeContentPlanItemDetails(
    parsedContentItem,
    tgChat.app.i18n,
    tgChat.app.appConfig.utcOffset
  );
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n' + contentInfoMsg
  );

  if (parsedPage) {
    // if has nested page
    const pageDetailsMsg = makePageDetailsMsg(parsedPage, tgChat.app.i18n);

    await tgChat.reply(
      tgChat.app.i18n.menu.pageContent + '\n\n' + pageDetailsMsg
    );
  }

  await tgChat.reply(makeContentLengthString(
    tgChat.app.i18n,
    clearTexts,
    parsedPage?.instaTags,
    footerStr
  ));

  if (!resolvedSns.length) await tgChat.reply(tgChat.app.i18n.errors.noSns);
}

export async function printPublishConfirmData(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  clearTexts: Record<SnType, string>,
  parsedPage?: RawPageContent
) {
  const footerStr = prepareFooter(
    tgChat.app.blogs[blogName].sn.telegram?.postFooter,
    parsedPage?.tgTags,
    true
  );

  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    );
  }

  await tgChat.reply(makeContentLengthString(
    tgChat.app.i18n,
    clearTexts,
    state.instaTags,
    footerStr
  ));

  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.linkWebPreview + tgChat.app.i18n.onOff[1] + '\n'
    + tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', ') + '\n'
    + tgChat.app.i18n.contentInfo.dateTime + ': ' + '\n'
    + makeHumanDateTimeStr(state.selectedDate, state.selectedTime, tgChat.app.appConfig.utcOffset)
  );

  if (state.sns.includes(SN_TYPES.instagram)) {
    await tgChat.reply(tgChat.app.i18n.menu.textForInstagram);
    await tgChat.reply(
      transformNotionToInstagramPost(parsedPage!.textBlocks)
      + '\n\n'
      + makeTagsString(state.instaTags)
    );
  }
}

export async function printImage(tgChat: TgChat, imgUrl?: string): Promise<string | undefined> {
  if (!imgUrl) return;

  try {
    await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, imgUrl);

    return imgUrl;
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantSendImage);
  }
}
