import TgChat from '../../apiTg/TgChat.js';
import {SnType} from '../../types/snTypes.js';
import ContentItem from '../../types/ContentItem.js';
import {askPublicationMenu} from './askPublicationMenu.js';
import {makeContentPlanFinalDetails} from '../../publish/printContentItemInfo.js';
import {WARN_SIGN} from '../../types/constants.js';
import {askConfirm} from '../common/askConfirm.js';
import {makeTgPostHtmlFromContentItem} from '../../notionHelpers/makeTgPostHtmlFromContentItem.js';
import PollData from '../../types/PollData.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {contentPublishFork} from '../../notionHelpers/contentPublishFork.js';
import {NotionBlocks} from '../../types/notion.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {validateContentPlanPost} from '../../notionHelpers/validateContentPlanPost.js';
import {MediaGroupItem} from '../../types/types.js';
import {printPost} from '../../publish/publishHelpers.js';
import {transformHtmlToCleanText} from '../../helpers/transformHtmlToCleanText.js';


export interface ContentItemState {
  useFooter: boolean
  usePreview: boolean
  sns: SnType[]
  pubTime: string
  instaTags?: string[]
  // initial image from notion
  mainImgUrl?: string
  // replaced by user from menu
  replacedMediaGroup?: MediaGroupItem[]
  // it's for announcement
  replacedHtmlText?: string
  replacedCleanText?: string
  urlBtn?: TgReplyBtnUrl
  autoDeleteIsoDateTime?: string
}


export async function startPublicationMenu(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnType[],
  item: ContentItem,
  pageBlocks?: NotionBlocks,
  mainImgUrl?: string,
  footerTgTmplMd?: string
) {
  const state: ContentItemState = {
    usePreview: true,
    useFooter: true,
    sns: resolvedSns,
    pubTime: item.time,
    instaTags: item.instaTags,
    mainImgUrl,
  }

  await askPublicationMenu(
    blogName,
    tgChat,
    state,
    item,
    validateContentPlanPost,
    tgChat.asyncCb(async () => {
      let pollData: PollData | undefined
      let postTexts: Partial<Record<SnType, string>> | undefined
      let cleanTexts: Partial<Record<SnType, string>> | undefined

      // TODO: если статья, то очистить mediaGroup

      const finalMediaGroup: MediaGroupItem[] = (state.replacedMediaGroup?.length)
        ? state.replacedMediaGroup
        : (
          (state.mainImgUrl)
            ? [{type: 'photoUrl', url: state.mainImgUrl}]
            : []
        )
      const postAsText = ([
        PUBLICATION_TYPES.article,
        PUBLICATION_TYPES.post2000,
        PUBLICATION_TYPES.announcement,
      ].includes(item.type))
      const usePreview = (typeof state.usePreview === 'undefined')
        ? postAsText
        : state.usePreview

      if (item.type === PUBLICATION_TYPES.poll) {

        // TODO: сформировать из notion pageBlocks

        pollData = {
          question: 'some question',
          options: ['1', '2'],
          isAnonymous: true,
          type: 'regular',
        }

        // TODO: print poll preview

      }
      else {
        postTexts = makeTgPostHtmlFromContentItem(
          state.sns,
          item,
          state,
          pageBlocks,
          footerTgTmplMd
        )
        cleanTexts = {}

        for (const sn in postTexts) {
          cleanTexts[sn as SnType] = await transformHtmlToCleanText(postTexts[sn as SnType]!)
        }

        // print post preview
        await printPost(
          tgChat.botChatId,
          tgChat,
          usePreview,
          postAsText,
          finalMediaGroup,
          state.urlBtn,
          postTexts?.telegram
        )
      }

      await tgChat.reply(makeContentPlanFinalDetails(
        blogName,
        tgChat,
        state,
        item,
        cleanTexts || {}
      ))

      await askConfirm(tgChat, tgChat.asyncCb(async () => {
        try {
          // Do publish
          await contentPublishFork(
            blogName,
            tgChat,
            item.type,
            item.date,
            state.pubTime,
            state.sns,
            finalMediaGroup,
            postAsText,
            usePreview,
            pollData,
            postTexts,
            // it's for article only
            pageBlocks,
            // article title
            item.nameGist,
            state.urlBtn,
            state.autoDeleteIsoDateTime
          );
        }
        catch (e) {
          await tgChat.reply(`${WARN_SIGN} ${e}`);
          await tgChat.steps.back();

          return;
        }

        await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
        await tgChat.steps.cancel();
      }), tgChat.app.i18n.commonPhrases.publishConfirmation);
    })
  );
}
