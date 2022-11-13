import TgChat from '../apiTg/TgChat';
import ContentItem, {SN_TYPES, SnTypes} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {makeDateTimeStr, makeTagsString, prepareFooter} from '../helpers/helpers';
import {makeContentPlanItemDetails} from './parseContent';
import {makePageDetailsMsg} from './parsePage';
import {makeContentLengthString} from './publishHelpers';
import {PublishMenuState} from '../askUser/askPublishMenu';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost';


export async function printItemDetails(
  blogName: string,
  tgChat: TgChat,
  clearTexts: Record<SnTypes, string>,
  resolvedSns: SnTypes[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent
) {
  const footerStr = prepareFooter(
    tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
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
  clearTexts: Record<SnTypes, string>,
  parsedPage?: RawPageContent
) {
  const footerStr = prepareFooter(
    tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
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
    tgChat.app.i18n.commonPhrases.selectedNoPreview + tgChat.app.i18n.onOff[1] + '\n'
    + tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', ') + '\n'
    + tgChat.app.i18n.contentInfo.dateTime + ': ' + '\n'
    + makeDateTimeStr(state.selectedDate, state.selectedTime, tgChat.app.appConfig.utcOffset)
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

export async function printImage(tgChat: TgChat, mainImgUrl?: string): Promise<string | undefined> {
  if (mainImgUrl) {
    try {
      await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, mainImgUrl);

      return mainImgUrl;
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.cantSendImage)
    }
  }
}
