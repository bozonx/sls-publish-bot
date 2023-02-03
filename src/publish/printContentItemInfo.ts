import TgChat from '../apiTg/TgChat.js';
import ContentItem from '../types/ContentItem.js';
import {isoDateToHuman, makeHumanDateTimeStr, prepareFooter} from '../helpers/helpers.js';
import {SnType} from '../types/snTypes.js';
import {NotionBlocks} from '../types/notion.js';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import {commonMdToTgHtml} from '../helpers/commonMdToTgHtml.js';
import {PUBLICATION_TYPES} from '../types/publicationType.js';
import ru from '../I18n/ru.js';
import {makeContentLengthDetails} from './publishHelpers.js';
import {transformHtmlToCleanText} from '../helpers/transformHtmlToCleanText.js';
import {makePostFromContentItem} from '../notionHelpers/makePostFromContentItem.js';


export async function printContentItemInitialDetails(
  tgChat: TgChat,
  resolvedSns: SnType[],
  contentItem: ContentItem,
  pageBlocks?: NotionBlocks,
  footerTmplMd?: string
) {
  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    const footerStr = await commonMdToTgHtml(prepareFooter(footerTmplMd, contentItem.tgTags,true))
    // print footer if it is used
    if (footerStr) {
      await tgChat.reply(
        tgChat.app.i18n.menu.postFooter + footerStr,
        undefined,
        true,
        true
      )
    }
  }
  const postTexts = await makePostFromContentItem(
    resolvedSns,
    contentItem,
    pageBlocks,
    footerTmplMd,
  )
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n'
    + await makeContentPlanPreDetails(
      contentItem,
      tgChat.app.i18n,
      tgChat.app.appConfig.utcOffset,
      resolvedSns,
      postTexts,
      pageBlocks,
      footerTmplMd
    )
  )
}


export async function makeContentPlanPreDetails(
  contentItem: ContentItem,
  i18n: typeof ru,
  utcOffset: number,
  resolvedSns: SnType[],
  postTexts: Partial<Record<SnType, string>>,
  pageBlocks?: NotionBlocks,
  footerTmplMd?: string
): Promise<string> {
  const result: string[] = [
    `${i18n.contentInfo.dateTime}: ${makeHumanDateTimeStr(contentItem.date, contentItem.time, utcOffset)}`,
    `${i18n.contentInfo.onlySn}: `
    + `${(contentItem.onlySn.length) ? contentItem.onlySn.join(', ') : i18n.contentInfo.noRestriction}`,
    `${i18n.contentInfo.type}: ${contentItem.type}`,
    `${i18n.contentInfo.status}: ${contentItem.status}`,
  ]

  if (contentItem.tgTags) {
    result.push(`${i18n.contentInfo.tgTags}: ${contentItem.tgTags.join(', ')}`)
  }

  if (contentItem.instaTags) {
    result.push(`${i18n.contentInfo.instaTags}: ${contentItem.instaTags.join(', ')}`)
  }

  if (contentItem.imageDescr) {
    result.push(`${i18n.contentInfo.imageDescr}: ${contentItem.imageDescr}`)
  }

  if (contentItem.nameGist) {
    result.push(`${i18n.contentInfo.name}/${i18n.contentInfo.gist}: ${contentItem.nameGist}`)
  }

  result.push(`${i18n.contentInfo.note}: ${contentItem.note}`)

  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    const contentLengthDetails = await makeContentLengthDetails(
      i18n,
      Boolean(footerTmplMd),
      postTexts,
      contentItem.instaTags
    )

    if (contentLengthDetails) result.push(contentLengthDetails)
  }

  return result.join('\n')
}

export async function makeContentPlanFinalDetails(
  blogName: string,
  tgChat: TgChat,
  state: ContentItemState,
  contentItem: ContentItem,
  usePreview: boolean,
  postTexts?: Partial<Record<SnType, string>>,
  footerTgTmplMd?: string
) {
  const result: string[] = [
    tgChat.app.i18n.commonPhrases.linkWebPreview
    + tgChat.app.i18n.onOff[Number(state.usePreview)],
    tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', '),
    tgChat.app.i18n.contentInfo.dateTime + ': '
    + makeHumanDateTimeStr(contentItem.date, state.pubTime, tgChat.app.appConfig.utcOffset)
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

  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    const contentLengthDetails = await makeContentLengthDetails(
      tgChat.app.i18n,
      Boolean(footerTgTmplMd),
      postTexts,
      state.instaTags,
    )

    if (contentLengthDetails) result.push(contentLengthDetails)
  }

  return result.join('\n')
}

/**
 * Print image and return it's url if the image was printed successfully
 */
export async function printImage(tgChat: TgChat, imgUrl?: string): Promise<string | undefined> {
  if (!imgUrl) return;

  try {
    await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, imgUrl)

    return imgUrl
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantSendImage)
  }
}
