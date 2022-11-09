import TgChat from '../apiTg/TgChat';
import ContentItem, {SnTypes} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {makeDateTimeStr, prepareFooter} from '../helpers/helpers';
import {makeContentPlanItemDetails} from './parseContent';
import {makePageDetailsMsg} from './parsePage';
import {NOTION_BLOCKS} from '../types/types';
import {makeContentLengthString} from './publishHelpers';
import {PublishMenuState} from '../askUser/askPublishMenu';


export async function printItemDetails(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnTypes[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string
) {
  await printImage(blogName, tgChat, mainImgUrl);
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
  resolvedSns: SnTypes[],
  state: PublishMenuState,
  parsedPage?: RawPageContent
) {
  const footerStr = prepareFooter(
    tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
    parsedPage?.tgTags,
    true
  );

  await printImage(blogName, tgChat, state.mainImgUrl);

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
    parsedPage?.instaTags,
    footerStr,
  );

  // TODO: текст для instagram

  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.selectedNoPreview + tgChat.app.i18n.onOff[1] + '\m'
    + tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', ')
    + tgChat.app.i18n.contentInfo.dateTime + ': '
    + makeDateTimeStr(state.selectedDate, state.selectedTime, tgChat.app.appConfig.utcOffset)
  );

  if (!state.sns.length) await tgChat.reply(tgChat.app.i18n.errors.noSns);
}

export async function printImage(blogName: string, tgChat: TgChat, mainImgUrl?: string) {
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