import TgChat from '../apiTg/TgChat.js';
import ContentItem from '../types/ContentItem.js';
import {isoDateToHuman, makeHumanDateTimeStr, prepareFooter} from '../helpers/helpers.js';
import {makeContentPlanItemDetails} from './parseContent.js';
import {SnType} from '../types/snTypes.js';
import {NotionBlocks} from '../types/notion.js';
import {PublishMenuState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import {commonMdToTgHtml} from '../helpers/commonMdToTgHtml.js';
import {clearMd} from '../helpers/clearMd.js';
import {PUBLICATION_TYPES} from '../types/publicationType.js';
import {makeClearTextsFromNotion} from '../notionHelpers/makeClearTextsFromNotion.js';
import {WARN_SIGN} from '../types/constants.js';


export async function printContentItemInitialDetails(
  tgChat: TgChat,
  resolvedSns: SnType[],
  parsedContentItem: ContentItem,
  pageBlocks?: NotionBlocks,
  footerTmplMd?: string
) {
  let cleanTexts: Partial<Record<SnType, string>> = {}
  let footerStr: string | undefined

  if (parsedContentItem.type !== PUBLICATION_TYPES.poll) {
    // make clear text if it isn't a poll
    cleanTexts = await makeClearTextsFromNotion(
      resolvedSns,
      parsedContentItem.type,
      true,
      footerTmplMd,
      pageBlocks,
      parsedContentItem.gist,
      parsedContentItem.instaTags,
      parsedContentItem.tgTags
    )
    footerStr = await commonMdToTgHtml(prepareFooter(footerTmplMd, parsedContentItem.tgTags,true))
  }

  // TODO: учитывать cleanTexts

  // print footer if it is used
  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    )
  }
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n'
    + makeContentPlanItemDetails(
      parsedContentItem,
      tgChat.app.i18n,
      tgChat.app.appConfig.utcOffset,
      cleanTexts
    )
  )

  if (!resolvedSns.length) await tgChat.reply(
    WARN_SIGN + ' ' + tgChat.app.i18n.errors.noSns
  )
}

export async function printPublishConfirmData(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  tgTags?: string[],
  pageBlocks?: NotionBlocks,
  clearTexts?: Record<SnType, string>,
) {
  const footerTmpl = tgChat.app.blogs[blogName].sn.telegram?.postFooter
  const footerTmplHtml = await commonMdToTgHtml(footerTmpl)
  const cleanFooterTmpl = await clearMd(footerTmpl)
  const footerStr = prepareFooter(footerTmplHtml, tgTags,true)

  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    )
  }

  // await tgChat.reply(makeContentLengthString(
  //   tgChat.app.i18n,
  //   clearTexts,
  //   state.instaTags,
  //   footerStr
  // ));

  // TODO: add footer ???

  const result: string[] = [
    tgChat.app.i18n.commonPhrases.linkWebPreview + tgChat.app.i18n.onOff[1],
    tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', '),
    tgChat.app.i18n.contentInfo.dateTime + ': '
    + makeHumanDateTimeStr(state.pubDate, state.pubTime, tgChat.app.appConfig.utcOffset)
  ]

  if (state.autoDeleteIsoDateTime) {
    result.push(
      `${tgChat.app.i18n.commonPhrases.autoDeletePostDate}: `
      + isoDateToHuman(state.autoDeleteIsoDateTime)
    )
  }

  if (state.instaTags) {
    result.push(`${tgChat.app.i18n.pageInfo.instaTagsCount}: ` + state.instaTags.length)
  }

  // if (pageBlocks && state.sns.includes(SN_TYPES.instagram)) {
  //   await tgChat.reply(tgChat.app.i18n.menu.textForInstagram);
  //   await tgChat.reply(
  //     transformNotionToInstagramPost(pageBlocks)
  //     + '\n\n'
  //     + makeTagsString(state.instaTags)
  //   );
  // }


  await tgChat.reply(result.join('\n'))
}

/**
 * Print image and return it's url if the image was printed successfully
 */
export async function printImage(tgChat: TgChat, imgUrl?: string): Promise<string | undefined> {
  if (!imgUrl) return;

  try {
    await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, imgUrl)

    return imgUrl;
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantSendImage)
  }
}
