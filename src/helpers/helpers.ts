import BaseState from '../types/BaseState';
import _ from 'lodash';
import moment from 'moment';
import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
import TgChat from '../apiTg/TgChat';
import {AppEvents, PRINT_FULL_DATE_FORMAT} from '../types/constants';
import TgReplyButton from '../types/TgReplyButton';
import {markdownv2 as mdFormat} from 'telegram-format';


export function makeBaseState(): BaseState {
  return {
    messageIds: [],
    handlerIndexes: [],
  };
}

export function makeTagsString(tags?: string[]): string {
  if (!tags || !tags.length) return '';

  return tags.map((item) => `#${item}`).join(' ');
}

export function makeFullNotionLink(pageId: string): string {
  return `https://www.notion.so/${pageId}`;
}

export function makeTelegraPhUrl(tgPath: string): string {
  return `https://telegra.ph/${tgPath}`;
}

export function isValidUrl(url: string): boolean {
  return Boolean(String(url).match(/^(https?|ftp)\:\/\//));
}

// export function makeFullNotionLink(internalLink: string): string {
//   if (internalLink.indexOf('http') === 0) return internalLink;
//
//   return `https://www.notion.so/${_.trimStart(internalLink, '/')}`
// }

/**
 * Match blog sns, onlySns and sn for specific publication type
 */
export function resolveSns(
  channelSns: SnTypes[],
  onlySns: SnTypes[],
  pubType: PublicationTypes
): SnTypes[] {
  let preSns = []

  if (onlySns.length) {
    preSns = onlySns;
  }
  else {
    preSns = matchSnsForType(pubType);
  }

  return _.intersection(channelSns, preSns);
}

export function matchSnsForType(pubType: PublicationTypes): SnTypes[] {
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ].includes(pubType)) {
    return [
      SN_TYPES.telegram,
      SN_TYPES.instagram,
      SN_TYPES.zen,
      SN_TYPES.site,
    ];
  }
  if (pubType === PUBLICATION_TYPES.article) {
    return [SN_TYPES.telegram, SN_TYPES.zen];
  }
  else if (pubType === PUBLICATION_TYPES.story) {
    return [SN_TYPES.telegram, SN_TYPES.instagram];
  }
  else if (pubType === PUBLICATION_TYPES.announcement) {
    return [SN_TYPES.telegram];
  }
  else if (pubType === PUBLICATION_TYPES.poll) {
    return [SN_TYPES.telegram];
  }
  else if (pubType === PUBLICATION_TYPES.reels) {
    return [
      SN_TYPES.telegram,
      SN_TYPES.instagram,
      SN_TYPES.zen,
      SN_TYPES.youtube,
      SN_TYPES.tiktok,
    ];
  }
  else if (pubType === PUBLICATION_TYPES.video) {
    return [ SN_TYPES.youtube, SN_TYPES.zen ];
  }
  else {
    throw new Error(`Unsupported publication type`);
  }
}

/**
 * Calculate seconds from now to specified date.
 * The number can be less than 0!
 */
export function calcSecondsToDate(toDateStr: string, utcOffset: number): number {
  const now = moment().utcOffset(utcOffset);
  const toDate = moment(toDateStr).utcOffset(utcOffset);

  return toDate.unix() - now.unix();
}

export async function addSimpleStep(
  tgChat: TgChat,
  msg: string,
  buttons: TgReplyButton[][],
  cb: (queryData: string) => void
) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => cb(queryData))
      ),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

export function validateTime(rawStr: string) {
  if (
    rawStr.indexOf(':') < 0
    || !moment(`2022-01-01T${rawStr}`).isValid()
  ) {
    throw new Error(`Incorrect time`);
  }
}

// prepareFooterPost
export function prepareFooter(tmpl?: string, tags: string[] = [], useFooter = true): string {
  if (!tmpl || !useFooter) return '';

  return _.template(tmpl)({
    TAGS: mdFormat.escape(makeTagsString(tags))
  });
}

export function makeUtcOffsetStr(utcOffsetNum: number): string {
  const timeStr = `${utcOffsetNum}:00 UTC`;

  if (utcOffsetNum < 0) {
    return `-${timeStr}`;
  }
  else if (utcOffsetNum === 0) {
    return timeStr;
  }
  else {
    return `+${timeStr}`;
  }
}

export function makeDateTimeStr(dateStr: string, timeStr: string, utcOffset: number): string {
  return moment(dateStr).format(PRINT_FULL_DATE_FORMAT)
    + ` ${timeStr} ${makeUtcOffsetStr(utcOffset)}`
}

/**
 * Remove formatting of md from text to use it for collecting symbols count.
 */
export function clearMdText(mdText = ''): string {
  // TODO: better to use unified
  // TODO: remove other formatting
  return mdText
    .replace(/\\/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
}
