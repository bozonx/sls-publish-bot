import TgChat from '../apiTg/TgChat.js';
import ContentItem from '../types/ContentItem.js';
import {makeHumanDateTimeStr, prepareFooter} from '../helpers/helpers.js';
import {makeContentPlanItemDetails} from './parseContent.js';
import {makeContentLengthString} from './publishHelpers.js';
import {transformNotionToInstagramPost} from '../helpers/transformNotionToInstagramPost.js';
import {makeTagsString} from '../lib/common.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {NotionBlocks} from '../types/notion.js';
import {PublishMenuState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import {commonMdToTgHtml} from '../helpers/commonMdToTgHtml.js';
import {clearMd} from '../helpers/clearMd.js';


export async function printContentItemDetails(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnType[],
  parsedContentItem: ContentItem,
  clearTexts?: Record<SnType, string>
) {

  // TODO: учитывать poll

  // TODO: или чо может в state затулить???
  const footerTmpl = tgChat.app.blogs[blogName].sn.telegram?.postFooter
  const footerTmplHtml = await commonMdToTgHtml(footerTmpl)
  const cleanFooterTmpl = await clearMd(footerTmpl)
  const footerStr = prepareFooter(footerTmplHtml, parsedContentItem.tgTags,true)
  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    )
  }

  // make content plan info details message
  const contentInfoMsg = makeContentPlanItemDetails(
    parsedContentItem,
    tgChat.app.i18n,
    tgChat.app.appConfig.utcOffset,
    cleanFooterTmpl
  );
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n' + contentInfoMsg
  );

  if (!resolvedSns.length) await tgChat.reply(tgChat.app.i18n.errors.noSns);
}

export async function printPublishConfirmData(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  clearTexts: Record<SnType, string>,
  tgTags?: string[],
  pageBlocks?: NotionBlocks
) {
  const footerStr = prepareFooter(
    tgChat.app.blogs[blogName].sn.telegram?.postFooter,
    tgTags,
    true
  )

  if (footerStr) {
    // TODO: будет HTML
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    )
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

  if (pageBlocks && state.sns.includes(SN_TYPES.instagram)) {
    await tgChat.reply(tgChat.app.i18n.menu.textForInstagram);
    await tgChat.reply(
      transformNotionToInstagramPost(pageBlocks)
      + '\n\n'
      + makeTagsString(state.instaTags)
    );
  }
}

/**
 * Print image and return it's url if the image was printed successfully
 */
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
