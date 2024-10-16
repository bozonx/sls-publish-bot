import TgChat from '../apiTg/TgChat';
import ContentItem from '../types/ContentItem';
import {isoDateToHuman, makeHumanDateTimeStr, prepareFooter, resolvePostFooter} from '../helpers/helpers';
import {SN_TYPES, SnType} from '../types/snTypes';
import {NotionBlocks} from '../types/notion';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu';
import {convertCommonMdToTgHtml} from '../helpers/convertCommonMdToTgHtml';
import {PUBLICATION_TYPES} from '../types/publicationType';
import ru from '../I18n/ru';
import {makeContentLengthDetails} from '../helpers/publishHelpers';
import {makePostFromContentItem} from './makePostFromContentItem';


export async function printContentItemInitialDetails(
  tgChat: TgChat,
  blogName: string,
  resolvedSns: SnType[],
  contentItem: ContentItem,
  availableTgFooter: boolean,
  pageBlocks?: NotionBlocks,
  instaTags?: string[]
) {
  if (contentItem.type !== PUBLICATION_TYPES.poll && availableTgFooter) {
    const tgFooterMd = resolvePostFooter(contentItem.type, tgChat.app.blogs[blogName].sn.telegram)
    const footerStr = convertCommonMdToTgHtml(prepareFooter(tgFooterMd, contentItem.sections))
    // print footer if it is used
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    )
  }
  const postTexts = makePostFromContentItem(
    resolvedSns,
    tgChat.app.blogs[blogName],
    contentItem,
    availableTgFooter,
    pageBlocks,
    undefined,
    instaTags
  )
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n'
    + makeContentPlanPreDetails(
      contentItem,
      tgChat.app.i18n,
      tgChat.app.appConfig.utcOffset,
      resolvedSns,
      availableTgFooter,
      postTexts
    )
  )
}


function makeContentPlanPreDetails(
  contentItem: ContentItem,
  i18n: typeof ru,
  utcOffset: number,
  resolvedSns: SnType[],
  useFooter: boolean,
  postTexts: Partial<Record<SnType, string>>,
): string {
  const result: string[] = [
    `${i18n.contentInfo.dateTime}: ${makeHumanDateTimeStr(contentItem.date, contentItem.time, utcOffset)}`,
    `${i18n.commonPhrases.sns}: ${resolvedSns.join(', ')}`,
    `${i18n.contentInfo.type}: ${contentItem.type}`,
    `${i18n.contentInfo.status}: ${contentItem.status}`,
  ]

  if (contentItem.sections) {
    result.push(`${i18n.contentInfo.sections}: ${contentItem.sections.join(', ')}`)
  }

  if (contentItem.instaTags?.length) {
    result.push(`${i18n.contentInfo.instaTags}: ${contentItem.instaTags.join(', ')}`)
  }

  if (contentItem.nameGist) {
    result.push(`${i18n.contentInfo.name}/${i18n.contentInfo.gist}: ${contentItem.nameGist}`)
  }

  result.push(`${i18n.contentInfo.note}: ${contentItem.note}`)

  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    const contentLengthDetails = makeContentLengthDetails(
      i18n,
      useFooter,
      postTexts,
      contentItem.instaTags
    )

    if (contentLengthDetails) result.push(contentLengthDetails)
  }

  return result.join('\n')
}

export function makeContentPlanFinalDetails(
  blogName: string,
  tgChat: TgChat,
  state: ContentItemState,
  contentItem: ContentItem,
  usePreview: boolean,
  useTgFooter: boolean,
  postTexts?: Partial<Record<SnType, string>>,
) {
  const result: string[] = [
    tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', '),
    tgChat.app.i18n.contentInfo.dateTime + ': '
    + makeHumanDateTimeStr(contentItem.date, state.pubTime, tgChat.app.appConfig.utcOffset)
  ]

  if ([
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.announcement,
  ].includes(contentItem.type)) {
    result.push(tgChat.app.i18n.commonPhrases.linkWebPreview
      + tgChat.app.i18n.onOff[Number(state.usePreview)])
  }

  if (state.autoDeleteTgIsoDateTime) {
    result.push(
      `${tgChat.app.i18n.commonPhrases.autoDeletePostDate}: `
      + isoDateToHuman(state.autoDeleteTgIsoDateTime)
    )
  }

  if (state.instaTags) {
    result.push(`${tgChat.app.i18n.pageInfo.instaTagsCount}: ` + state.instaTags.length)
  }

  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    const contentLengthDetails = makeContentLengthDetails(
      tgChat.app.i18n,
      useTgFooter,
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
