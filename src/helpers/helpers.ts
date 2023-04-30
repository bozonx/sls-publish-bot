import _ from 'lodash';
import moment from 'moment';
import {compactUndefined} from 'squidlet-lib';
import BaseState from '../types/BaseState.js';
import TgChat from '../apiTg/TgChat.js';
import {ChatEvents, ISO_DATE_FORMAT, PRINT_FULL_DATE_FORMAT} from '../types/constants.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import {BlogBaseConfig, BlogTelegramConfig} from '../types/BlogsConfig.js';
import {isPromise, makeTagsString} from '../lib/common.js';
import {SN_SUPPORT_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {convertHtmlToCleanText} from './convertHtmlToCleanText.js';
import AppConfig from '../types/AppConfig.js';


export function makeBaseState(): BaseState {
  return {
    messageIds: [],
    handlerIndexes: [],
  };
}

// export function makeFullNotionLink(pageId: string): string {
//   return `https://www.notion.so/${pageId}`;
// }

export function makeTelegraPhUrl(tgPath: string): string {
  return `https://telegra.ph/${tgPath}`;
}

export function makeMyDomain(appConfig: AppConfig): string {
  if (
    !appConfig.webServerExternalPort
    || [80, 443].includes(appConfig.webServerExternalPort)
  ) {
    return appConfig.hostname
  }

  return `${appConfig.hostname}:${appConfig.webServerExternalPort}`
}

export function makeMyWebUrl(appConfig: AppConfig): string {
  const protocol = (appConfig.isProduction) ? 'https' : 'http'

  return `${protocol}://${makeMyDomain(appConfig)}`
}

export function makeBloggerEditPostUrl(blogId: string, postId: string): string {
  return `https://www.blogger.com/blog/post/edit/${blogId}/${postId}`
}

/**
 * Match blog sns, onlySns and sn for specific publication type
 */
export function resolveSns(
  blogSns: SnType[],
  onlySns: SnType[],
  pubType: PublicationType
): SnType[] {
  let filteredSns = []

  if (onlySns.length) {
    // user specified only that sns - we should use only them
    filteredSns = onlySns
  }
  else {
    // filter that sns which is compared with publication type
    filteredSns = matchSnsForType(pubType)
  }
  // compare all the blogs sns with filtered
  return _.intersection(blogSns, filteredSns)
}

export function matchSnsForType(pubType: PublicationType): SnType[] {
  const sns: SnType[] = []

  for (const sn of Object.keys(SN_SUPPORT_TYPES)) {
    if (SN_SUPPORT_TYPES[sn].indexOf(pubType) >= 0) {
      sns.push(sn as SnType)
    }
  }

  return sns
}


export async function addSimpleStep(
  tgChat: TgChat,
  init: () => ([string, TgReplyButton[][]] | Promise<[string, TgReplyButton[][]]>),
  cb: (queryData: string) => void,
  stepName?: string
) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    const initResult = init()
    const [msg, buttons] = (isPromise(initResult))
      ? await initResult
      : initResult as [string, TgReplyButton[][]]
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons, true))
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        // This it to make it safe and put error message to the LOG
        // TODO: сделать просто через улавливание ошибок
        tgChat.asyncCb(async (queryData: string) => cb(queryData))
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  }, undefined, stepName);
}

export function makeUtcOffsetStr(utcOffsetNum: number): string {
  const isoStr = makeIsoUtcOffsetStr(utcOffsetNum);

  return `${(isoStr === 'Z') ? '00:00' : isoStr} UTC`;
}

export function makeIsoUtcOffsetStr(utcOffsetNum: number): string {
  const timeStr = `${(utcOffsetNum <= 9) ? `0${utcOffsetNum}` : utcOffsetNum}:00`;

  if (utcOffsetNum < 0) {
    return `-${timeStr}`;
  }
  else if (utcOffsetNum === 0) {
    return 'Z';
  }
  else {
    return `+${timeStr}`;
  }
}

export function makeHumanDateTimeStr(dateStr: string, timeStr: string, utcOffset: number): string {
  return moment(dateStr).format(PRINT_FULL_DATE_FORMAT)
    + ` ${timeStr} ${makeUtcOffsetStr(utcOffset)}`
}

export function makeHumanDateStr(dateStr: string, utcOffset: number): string {
  return moment(dateStr).format(PRINT_FULL_DATE_FORMAT) + ` ${makeUtcOffsetStr(utcOffset)}`
}

export function makeIsoDateTimeStr(isoDateStr: string, timeStr: string, utcOffset: number): string {
  if (!isoDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error(`The date isn't in ISO format - ${isoDateStr}`)
  }

  return `${isoDateStr}T${timeToIso(timeStr)}:00${makeIsoUtcOffsetStr(utcOffset)}`
}

export function isoDateToHuman(isoDate: string): string {
  return moment(isoDate).format(PRINT_FULL_DATE_FORMAT + ' HH:mm Z') + ' UTC'
}

export function timeToIso(rawTimeStr: string): string {
  if (rawTimeStr.match(/^\d\D/)) {
    return '0' + rawTimeStr
  }

  return rawTimeStr
}

export function addHorsInDate(isoDateTime: string, hours: number): string {
  return moment(isoDateTime)
    .add(hours, 'hours')
    .format()
}

export function replaceHorsInDate(isoDateTime: string, hours: number): string {
  return moment(isoDateTime)
    .hours(hours)
    .format()
}

export function compactButtons(buttons: ((TgReplyButton | undefined)[] | undefined)[]): TgReplyButton[][] {
  return compactUndefined(buttons)
    .map((item) => compactUndefined(item))
    .filter((item) => Boolean(item.length));
}

/**
 * Make full post text with footer.
 * It doesn't matter if it html or md
 */
export function makeResultPostText(
  tags: string[],
  useFooter: boolean,
  // clean or full text
  postText?: string,
  // clean or full footer
  footerTmpl?: string
): string {
  const footerStr = prepareFooter(footerTmpl, tags, useFooter)

  return _.trim((_.trim(postText) || '') + '\n\n' + footerStr)
}

// prepareFooterPost
export function prepareFooter(tmpl?: string, tags: string[] = [], useFooter = true): string {
  if (!tmpl || !useFooter) return '';

  // TODO: useFooter не нужнен ???

  return _.template(tmpl)({
    TAGS: makeTagsString(tags)
  });
}

/**
 * Resolve footer which is corresponding to publication type
 */
export function resolvePostFooter(
  pubType: PublicationType,
  blogConfig?: BlogBaseConfig
): string | undefined {
  if (!blogConfig) return

  switch (pubType) {
    case PUBLICATION_TYPES.article:
      return
    case PUBLICATION_TYPES.poll:
      return
    case PUBLICATION_TYPES.mem:
      if ((blogConfig as BlogTelegramConfig)?.memFooter)
        return (blogConfig as BlogTelegramConfig)?.memFooter

      break
    case PUBLICATION_TYPES.story:
      if ((blogConfig as BlogTelegramConfig)?.storyFooter)
        return (blogConfig as BlogTelegramConfig)?.storyFooter

      break
    case PUBLICATION_TYPES.reels:
      if ((blogConfig as BlogTelegramConfig)?.reelFooter)
        return (blogConfig as BlogTelegramConfig)?.reelFooter

      break
  }
  // post1000, post2000, announcement, photos, narrative
  return (blogConfig as BlogTelegramConfig)?.postFooter
}

export function makeCleanTexts(
  postTexts?: Partial<Record<SnType, string>>
): Partial<Record<SnType, string>> | undefined {
  if (!postTexts) return

  return {
    telegram: convertHtmlToCleanText(postTexts.telegram),
    // do not need to clear instagram text
    instagram: postTexts.instagram,
    // blogger doesn't matter
  }
}
