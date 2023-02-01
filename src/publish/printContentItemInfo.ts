import TgChat from '../apiTg/TgChat.js';
import ContentItem from '../types/ContentItem.js';
import {isoDateToHuman, makeHumanDateTimeStr, prepareFooter} from '../helpers/helpers.js';
import {SnType} from '../types/snTypes.js';
import {NotionBlocks} from '../types/notion.js';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import {commonMdToTgHtml} from '../helpers/commonMdToTgHtml.js';
import {clearMd} from '../helpers/clearMd.js';
import {PUBLICATION_TYPES} from '../types/publicationType.js';
import {WARN_SIGN} from '../types/constants.js';
import ru from '../I18n/ru.js';
import {makeClearTextsFromNotion} from '../notionHelpers/makeClearTextsFromNotion.js';
import {makeContentLengthDetails} from './publishHelpers.js';


export async function printContentItemInitialDetails(
  tgChat: TgChat,
  resolvedSns: SnType[],
  parsedContentItem: ContentItem,
  pageBlocks?: NotionBlocks,
  footerTmplMd?: string
) {
  if (parsedContentItem.type !== PUBLICATION_TYPES.poll) {
    const footerStr = await commonMdToTgHtml(prepareFooter(footerTmplMd, parsedContentItem.tgTags,true))
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

  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n'
    + await makeContentPlanPreDetails(
      parsedContentItem,
      tgChat.app.i18n,
      tgChat.app.appConfig.utcOffset,
      resolvedSns,
      pageBlocks,
      footerTmplMd
    )
  )

  if (!resolvedSns.length) await tgChat.reply(
    WARN_SIGN + ' ' + tgChat.app.i18n.errors.noSns
  )
}


export async function makeContentPlanPreDetails(
  contentItem: ContentItem,
  i18n: typeof ru,
  utcOffset: number,
  resolvedSns: SnType[],
  pageBlocks?: NotionBlocks,
  footerTmplMd?: string
): Promise<string> {
  let cleanTexts: Partial<Record<SnType, string>> = {}

  // TODO: а если poll ???
  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    // make clear text if it isn't a poll
    cleanTexts = await makeClearTextsFromNotion(
      resolvedSns,
      contentItem.type,
      true,
      footerTmplMd,
      pageBlocks,
      contentItem.nameGist,
      contentItem.instaTags,
      contentItem.tgTags
    )
  }

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

  const contentLengthDetails = makeContentLengthDetails(
    i18n,
    cleanTexts,
    contentItem.instaTags,
    Boolean(footerTmplMd)
  )

  if (contentLengthDetails) result.push(contentLengthDetails)

  return result.join('\n')
}

export function makeContentPlanFinalDetails(
  blogName: string,
  tgChat: TgChat,
  state: ContentItemState,
  contentItem: ContentItem,
  usePreview: boolean,
  cleanTexts?: Partial<Record<SnType, string>>,
  footerTgTmplMd?: string
) {
  // TODO: наверное лучше готовый html превращать в чистый


  // TODO: учитывать poll

  // TODO: почему здесь ???
  // const clearTexts = makeClearTextsFromNotion(
  //   state.sns,
  //   state.pubType,
  //   state.useFooter,
  //   tgChat.app.blogs[blogName].sn.telegram,
  //   pageBlocks,
  //   // TODO: это только для анонса
  //   state.replacedHtmlText,
  //   state.instaTags,
  //   parsedContentItem.tgTags,
  // );


  // // TODO: преобразовывать только после вставки тэгов
  // const footerTmplHtml = await commonMdToTgHtml(footerTmpl)
  // const cleanFooterTmpl = await clearMd(footerTmpl)
  // const footerStr = prepareFooter(footerTmplHtml, tgTags,true)

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
    result.push(makeContentLengthDetails(
      tgChat.app.i18n,
      cleanTexts || {},
      state.instaTags,
      Boolean(footerTgTmplMd)
    ))
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
