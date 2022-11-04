import BaseState from '../types/BaseState';
import _ from 'lodash';
import moment from 'moment';
import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
import TgChat from '../apiTg/TgChat';
import {AppEvents} from '../types/constants';
import TgReplyButton from '../types/TgReplyButton';
import {markdownv2 as mdFormat} from 'telegram-format';


export function makeBaseState(): BaseState {
  return {
    messageIds: [],
    handlerIndexes: [],
  };
}

export function makeTagsString(tags: string[]): string {
  if (!tags.length) return '';

  return tags.map((item) => `#${item}`).join(' ');
}

export function makeFullNotionLink(pageId: string): string {
  return `https://www.notion.so/${pageId}`;
}

// export function makeFullNotionLink(internalLink: string): string {
//   if (internalLink.indexOf('http') === 0) return internalLink;
//
//   return `https://www.notion.so/${_.trimStart(internalLink, '/')}`
// }

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

export function prepareFooterPost(text?: string, tags?: string[]): string {
  if (!text) return '';

  const resolvedText: string = (tags)
    ? _.template(text)({TAGS: mdFormat.escape(makeTagsString(tags))})
    : text

  return resolvedText;
}
