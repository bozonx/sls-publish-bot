import _ from 'lodash';
import moment from 'moment';
import BaseState from '../types/BaseState.js';
import TgChat from '../apiTg/TgChat.js';
import {ChatEvents, ISO_DATE_FORMAT, PRINT_FULL_DATE_FORMAT} from '../types/constants.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import {BlogBaseConfig, BlogTelegramConfig} from '../types/BlogsConfig.js';
import {isPromise, makeTagsString} from '../lib/common.js';
import {SN_SUPPORT_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {compactUndefined} from '../lib/arrays.js';


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

/**
 * Match blog sns, onlySns and sn for specific publication type
 */
export function resolveSns(
  blogSns: SnType[],
  onlySns: SnType[],
  pubType: PublicationType
): SnType[] {
  let filteredSns = [];

  if (onlySns.length) {
    // user specified only that sns - we should use only them
    filteredSns = onlySns;
  }
  else {
    // filter that sns which is compared with publication type
    filteredSns = matchSnsForType(pubType);
  }

  // compare all the blogs sns with filtered
  return _.intersection(blogSns, filteredSns);
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

export function makeIsoDateTimeStr(dateStr: string, timeStr: string, utcOffset: number): string {
  // TODO: вылазиет предупреждение что не точный ISO формат
  return moment(
    moment(dateStr).utcOffset(utcOffset).format(ISO_DATE_FORMAT)
    + ' ' + timeStr
  ).format()
}

export function isoDateToHuman(isoDate: string): string {
  return moment(isoDate).format(PRINT_FULL_DATE_FORMAT + ' HH:mm Z') + ' UTC'
}

export function replaceHorsInDate(isoDateTime: string, hours: number): string {
  return moment(isoDateTime)
    .add(hours, 'hours')
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
  blogConfig: BlogBaseConfig
): string | undefined {
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
