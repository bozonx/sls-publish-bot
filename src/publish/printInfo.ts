import TgChat from '../apiTg/TgChat';
import ContentItem, {SN_TYPES, SnTypes} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {makeDateTimeStr, makeTagsString, prepareFooter} from '../helpers/helpers';
import {makeContentPlanItemDetails} from './parseContent';
import {makePageDetailsMsg} from './parsePage';
import {NOTION_BLOCKS} from '../types/types';
import {makeContentLengthString} from './publishHelpers';
import {PublishMenuState} from '../askUser/askPublishMenu';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost';


export async function printItemDetails(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnTypes[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string
) {
  await printImage(tgChat, mainImgUrl);
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

  await printContent(
    blogName,
    tgChat,
    parsedPage?.textBlocks,
    parsedContentItem.gist,
    parsedPage?.tgTags,
    parsedPage?.instaTags,
    footerStr,
  );

  if (!resolvedSns.length) await tgChat.reply(tgChat.app.i18n.errors.noSns);
}

export async function printPublishConfirmData(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  parsedPage?: RawPageContent
) {
  const footerStr = prepareFooter(
    tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
    parsedPage?.tgTags,
    true
  );

  await printImage(tgChat, state.mainImgUrl);

  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    );
  }

  await printContent(
    blogName,
    tgChat,
    parsedPage?.textBlocks,
    state.postText,
    parsedPage?.tgTags,
    state.instaTags,
    footerStr,
  );

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

export async function printImage(tgChat: TgChat, mainImgUrl?: string) {
  if (mainImgUrl) {
    try {
      await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, mainImgUrl)
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.cantSendImage)
    }
  }
}

export async function printContent(
  blogName: string,
  tgChat: TgChat,
  textBlocks?: NOTION_BLOCKS,
  postText?: string,
  tgTags?: string[],
  instaTags?: string[],
  footerStr?: string,
) {
  if (textBlocks) {
    await tgChat.reply(makeContentLengthString(
      tgChat.app.i18n,
      textBlocks,
      tgTags,
      instaTags,
      footerStr
    ));
  }
  else {
    await tgChat.reply(
      tgChat.app.i18n.menu.announcementGist + '\n' + postText
    );
  }
}
