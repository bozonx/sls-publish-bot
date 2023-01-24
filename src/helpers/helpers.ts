import _ from 'lodash';
import moment from 'moment';
import BaseState from '../types/BaseState.js';
import TgChat from '../apiTg/TgChat.js';
import {ChatEvents, ISO_DATE_FORMAT, PRINT_FULL_DATE_FORMAT} from '../types/constants.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import {BlogTelegramConfig} from '../types/BlogsConfig.js';
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
  const sns: SnType[] = [];

  for (const sn in Object.keys(SN_SUPPORT_TYPES)) {
    if (SN_SUPPORT_TYPES[sn].indexOf(pubType) >= 0) {
      sns.push(sn as SnType);
    }
  }

  return sns;
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
  // TODO: сделать  всё через moment
  return moment(dateStr).format(ISO_DATE_FORMAT)
    + `T${timeStr}:00${makeIsoUtcOffsetStr(utcOffset)}`
}

export function isoDateToHuman(isoDate: string): string {
  return moment(isoDate).format(PRINT_FULL_DATE_FORMAT + ' HH:mm Z') + ' UTC'
}

export function replaceHorsInDate(isoDateTime: string, hours: number): string {
  return moment(isoDateTime)
    .add(hours, 'hours')
    .format()
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
  const footerStr = prepareFooter(footerTmpl, tags, useFooter);

  return _.trim((_.trim(postText) || '') + '\n\n' + footerStr);
}

export function compactButtons(buttons: ((TgReplyButton | undefined)[] | undefined)[]): TgReplyButton[][] {
  return compactUndefined(buttons)
    .map((item) => compactUndefined(item))
    .filter((item) => Boolean(item.length));
}

export function resolveTgFooter(
  useTgFooter: boolean,
  pubType: PublicationType,
  tgBlogConfig?: BlogTelegramConfig
): string | undefined {
  if (!useTgFooter) return;

  let footerStr: string | undefined;

  switch (pubType) {
    case PUBLICATION_TYPES.article:
      // TODO: свой футер !!!!
      //footerStr = tgBlogConfig?.storyFooter;
      //tgChat.app.blogs[blogName].sn.telegram?.articleFooter,
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
