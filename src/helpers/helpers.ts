import BaseState from '../types/BaseState';
import _ from 'lodash';
import moment from 'moment';
import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES, SnTypes} from '../types/ContentItem';
import TgChat from '../apiTg/TgChat';
import {AppEvents, PRINT_FULL_DATE_FORMAT} from '../types/constants';
import TgReplyButton from '../types/TgReplyButton';
import {markdownv2 as mdFormat} from 'telegram-format';
import {BlogTelegramConfig} from '../types/ExecConfig';
import {makeTagsString} from '../lib/common';


export function makeBaseState(): BaseState {
  return {
    messageIds: [],
    handlerIndexes: [],
  };
}

export function makeFullNotionLink(pageId: string): string {
  return `https://www.notion.so/${pageId}`;
}

export function makeTelegraPhUrl(tgPath: string): string {
  return `https://telegra.ph/${tgPath}`;
}

/**
 * Match blog sns, onlySns and sn for specific publication type
 */
export function resolveSns(
  blogSns: SnTypes[],
  onlySns: SnTypes[],
  pubType: PublicationTypes
): SnTypes[] {
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

// prepareFooterPost
export function prepareFooter(tmpl?: string, tags: string[] = [], useFooter = true): string {
  if (!tmpl || !useFooter) return '';

  // TODO: useFooter не нужнен

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

export function resolveTgFooter(
  useTgFooter: boolean,
  pubType: PublicationTypes,
  tgBlogConfig?: BlogTelegramConfig
): string | undefined {
  if (!useTgFooter) return;

  let footerStr: string | undefined;

  switch (pubType) {
    case PUBLICATION_TYPES.article:
      // TODO: свой футер !!!!
      //footerStr = tgBlogConfig?.storyFooter;
      //tgChat.app.config.blogs[blogName].sn.telegram?.articleFooter,
      // const cleanText = transformNotionToCleanText(textBlocks);
      break;
    case PUBLICATION_TYPES.mem:
      footerStr = tgBlogConfig?.memFooter;

      break;
    case PUBLICATION_TYPES.story:
      footerStr = tgBlogConfig?.storyFooter;

      break;
    case PUBLICATION_TYPES.reels:
      footerStr = tgBlogConfig?.reelFooter;

      break;
    case PUBLICATION_TYPES.poll:
      break;

    // TODO: ??? photos, narrative - наверное свои футеры

    default:
      // post1000, post2000, announcement
      footerStr = tgBlogConfig?.postFooter;

      break;
  }

  return footerStr;
}
