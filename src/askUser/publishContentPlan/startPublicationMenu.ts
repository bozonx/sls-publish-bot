import TgChat from '../../apiTg/TgChat.js';
import {SN_TYPES, SnType} from '../../types/snTypes.js';
import ContentItem from '../../types/ContentItem.js';
import {askPublicationMenu} from './askPublicationMenu.js';
import {makeContentPlanFinalDetails} from '../../publish/printContentItemInfo.js';
import {WARN_SIGN} from '../../types/constants.js';
import {askConfirm} from '../common/askConfirm.js';
import {makePostFromContentItem} from '../../notionHelpers/makePostFromContentItem.js';
import PollData from '../../types/PollData.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {contentPublishFork} from '../../notionHelpers/contentPublishFork.js';
import {NotionBlocks} from '../../types/notion.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {validateContentPlanPost} from '../../notionHelpers/validateContentPlanPost.js';
import {MediaGroupItem} from '../../types/types.js';
import {printPost} from '../../publish/publishHelpers.js';


export interface ContentItemState {
  useTgFooter: boolean
  // is it specified in blog config
  availableTgFooter: boolean
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
  //replacedCleanText?: string
  tgUrlBtn?: TgReplyBtnUrl
  autoDeleteTgIsoDateTime?: string
}


export async function startPublicationMenu(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnType[],
  availableTgFooter: boolean,
  item: ContentItem,
  pageBlocks?: NotionBlocks,
  mainImgUrl?: string,
) {
  const state: ContentItemState = {
    usePreview: true,
    useTgFooter: availableTgFooter,
    availableTgFooter,
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
    (state: ContentItemState) => validateContentPlanPost(
      tgChat,
      blogName,
      item,
      state,
      pageBlocks
    ),
    tgChat.asyncCb(async () => {
      let pollData: PollData | undefined
      let postTexts: Partial<Record<SnType, string>> | undefined
      const postAsText = ([
        PUBLICATION_TYPES.article,
        PUBLICATION_TYPES.post2000,
        PUBLICATION_TYPES.announcement,
      ].includes(item.type))
      const usePreview = (typeof state.usePreview === 'undefined')
        ? postAsText
        : state.usePreview
      let finalMediaGroup: MediaGroupItem[] = []

      if (![
        PUBLICATION_TYPES.article,
        PUBLICATION_TYPES.poll
      ].includes(item.type)) {
        if (state.replacedMediaGroup?.length) finalMediaGroup = state.replacedMediaGroup
        else if (state.mainImgUrl) finalMediaGroup = [{type: 'photoUrl', url: state.mainImgUrl}]
      }

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
        // TODO: для article тоже не надо же делать
        postTexts = await makePostFromContentItem(
          state.sns,
          tgChat.app.blogs[blogName],
          item,
          state.useTgFooter,
          pageBlocks,
          state.replacedHtmlText,
          state.instaTags
        )

        if (state.sns.includes(SN_TYPES.telegram)) {
          // print telegram post preview
          await printPost(
            tgChat.botChatId,
            tgChat,
            usePreview,
            postAsText,
            finalMediaGroup,
            state.tgUrlBtn,
            postTexts?.telegram
          )
        }
      }
      // make text for instagram
      if (pageBlocks && state.sns.includes(SN_TYPES.instagram) && postTexts?.instagram) {
        await tgChat.reply(tgChat.app.i18n.menu.textForInstagram)
        await tgChat.reply(postTexts.instagram)
      }
      // print details
      await tgChat.reply(await makeContentPlanFinalDetails(
        blogName,
        tgChat,
        state,
        item,
        usePreview,
        state.useTgFooter,
        postTexts,
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
            state.tgUrlBtn,
            state.autoDeleteTgIsoDateTime,
            item.tgTags
          );
        }
        catch (e) {
          await tgChat.reply(`${WARN_SIGN} ${e}`)
          await tgChat.steps.back()

          return
        }

        await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
        await tgChat.steps.cancel()
      }), tgChat.app.i18n.commonPhrases.publishConfirmation)
    })
  );
}
