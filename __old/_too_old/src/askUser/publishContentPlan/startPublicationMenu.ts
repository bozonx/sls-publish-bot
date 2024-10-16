import TgChat from '../../apiTg/TgChat';
import {SN_TYPES, SnType} from '../../types/snTypes';
import ContentItem from '../../types/ContentItem';
import {askPublicationMenu, PUBLISH_MENU_ACTION} from './askPublicationMenu';
import {makeContentPlanFinalDetails} from '../../contentPlan/printContentItemInfo';
import {WARN_SIGN} from '../../types/constants';
import {askConfirm} from '../common/askConfirm';
import {makePostFromContentItem} from '../../contentPlan/makePostFromContentItem';
import PollData from '../../types/PollData';
import {PUBLICATION_TYPES} from '../../types/publicationType';
import {contentPublishFork} from '../../contentPlan/contentPublishFork';
import {NotionBlocks} from '../../types/notion';
import {TgReplyBtnUrl} from '../../types/TgReplyButton';
import {validateContentPlanPost} from '../../contentPlan/validateContentPlanPost';
import {MediaGroupItem} from '../../types/types';
import {printPost} from '../../helpers/publishHelpers';
import {justPublishToTelegraph} from '../../contentPlan/makePublishTaskTgArticle';
import {generateZenData} from './generateZenData';
import {makeMyDomain, makeMyWebUrl} from '../../helpers/helpers';


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
  articleAnnounceMd?: string
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
    tgChat.asyncCb(async (action?: keyof typeof PUBLISH_MENU_ACTION) => {
      if (action === PUBLISH_MENU_ACTION.ONLY_MAKE_TELEGRAPH_ARTICLE) {
        const publishUrl = await justPublishToTelegraph(
          blogName,
          tgChat,
          item.nameGist!,
          pageBlocks!
        )

        await tgChat.reply(publishUrl)
        await tgChat.steps.cancel()

        return
      }
      else if (action === PUBLISH_MENU_ACTION.MAKE_ZEN_ARTICLE) {
        tgChat.app.webServer.setZenDataHandler(() => generateZenData(
          blogName,
          tgChat,
          item,
          state,
          pageBlocks,
          mainImgUrl
        ))

        await tgChat.reply(
          tgChat.app.i18n.message.zenData + '\n'
          //+ `http://${makeMyDomain(tgChat.app.appConfig)}/zendata`,
          + makeMyWebUrl(tgChat.app.appConfig) + '/zendata',
          undefined,
          true
        )

        return
      }

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
      else if (item.type === PUBLICATION_TYPES.article) {
        // do nothing on article case
      }
      else {
        postTexts = makePostFromContentItem(
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
          try {
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
          catch (e) {
            await tgChat.reply(String(e))

            return
          }
        }
      }
      // make text for instagram
      if (pageBlocks && state.sns.includes(SN_TYPES.instagram) && postTexts?.instagram) {
        await tgChat.reply(tgChat.app.i18n.menu.textForInstagram)
        await tgChat.reply(postTexts.instagram)
      }
      // print details
      await tgChat.reply(makeContentPlanFinalDetails(
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
          try {
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
              state.articleAnnounceMd,
              state.tgUrlBtn,
              state.autoDeleteTgIsoDateTime,
              item.sections
            )
          }
          catch (e) {
            await tgChat.reply(String(e))

            return
          }
        }
        catch (e) {
          await tgChat.reply(`${WARN_SIGN} ${e}`)
          await tgChat.steps.back()

          return
        }

        await tgChat.steps.cancel()
      }), tgChat.app.i18n.commonPhrases.publishConfirmation)
    })
  );
}
