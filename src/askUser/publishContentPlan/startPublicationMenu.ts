import TgChat from '../../apiTg/TgChat.js';
import {SnType} from '../../types/snTypes.js';
import ContentItem from '../../types/ContentItem.js';
import {askPublicationMenu} from './askPublicationMenu.js';
import {makeContentPlanFinalDetails} from '../../publish/printContentItemInfo.js';
import {WARN_SIGN} from '../../types/constants.js';
import {askConfirm} from '../common/askConfirm.js';
import {makeTgHtmlFromNotion} from '../../notionHelpers/makeTgHtmlFromNotion.js';
import PollData from '../../types/PollData.js';
import {PUBLICATION_TYPES, PublicationType} from '../../types/publicationType.js';
import {publishFork} from '../../publish/publishFork.js';
import {NotionBlocks} from '../../types/notion.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {validateContentPlanPost} from '../../notionHelpers/validateContentPlanPost.js';
import {MediaGroupItem} from '../../types/types.js';
import {printPost} from '../../publish/publishHelpers.js';
import {transformHtmlToCleanText} from '../../helpers/transformHtmlToCleanText.js';


export interface PublishMenuState {
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
  // TODO: использовать
  //footerTmplMd?: string
) {
  const state: PublishMenuState = {
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

      if (item.type === PUBLICATION_TYPES.poll) {

        // TODO: сформировать из notion

        pollData = {
          question: 'some question',
          options: ['1', '2'],
          isAnonymous: true,
          type: 'regular',
        }
      }
      else {
        postTexts = makeTgHtmlFromNotion(
          state.sns,
          item.type,
          state.useFooter,
          // TODO: наверное передать уже готовый футер
          tgChat.app.blogs[blogName].sn.telegram,
          pageBlocks,
          // TODO: это только для анонса
          state.replacedHtmlText,
          state.instaTags,
          item.tgTags,
        )
        cleanTexts = {}

        for (const sn in postTexts) {
          cleanTexts[sn as SnType] = await transformHtmlToCleanText(postTexts[sn as SnType]!)
        }
      }

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
      //announcement
      // print preview
      await printPost(
        tgChat.botChatId,
        tgChat,
        (typeof state.usePreview === 'undefined')
          ? postAsText
          : state.usePreview,
        postAsText,
        finalMediaGroup,
        state.urlBtn,
        postTexts?.telegram
      )

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
          await publishFork(
            blogName,
            tgChat,
            state,
            item.type,
            postTexts || {},
            // it's for article only
            pageBlocks,
            // article title
            item.nameGist,
            pollData
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
