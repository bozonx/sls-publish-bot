import TgChat from '../../apiTg/TgChat.js';
import {SnType} from '../../types/snTypes.js';
import ContentItem from '../../types/ContentItem.js';
import {askPublicationMenu} from './askPublicationMenu.js';
import {makeContentPlanFinalDetails} from '../../publish/printContentItemInfo.js';
import {WARN_SIGN} from '../../types/constants.js';
import {askConfirm} from '../common/askConfirm.js';
import {makeTgPostTextFromNotion} from '../../helpers/makeTgPostTextFromNotion.js';
import PollData from '../../types/PollData.js';
import {PUBLICATION_TYPES, PublicationType} from '../../types/publicationType.js';
import {publishFork} from '../../publish/publishFork.js';
import {NotionBlocks} from '../../types/notion.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {validateContentPlanPost} from '../../notionHelpers/validateContentPlanPost.js';
import {MediaGroupItem} from '../../types/types.js';
import {printPost} from '../../publish/publishHelpers.js';


export interface PublishMenuState {
  // TODO: впринципе тут не нужно
  pubType: PublicationType
  useFooter: boolean
  usePreview: boolean
  sns: SnType[]
  // TODO: впринципе тут не нужно
  pubDate: string
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
  parsedContentItem: ContentItem,
  pageBlocks?: NotionBlocks,
  mainImgUrl?: string,
  // TODO: использовать
  //footerTmplMd?: string
) {
  const state: PublishMenuState = {
    pubType: parsedContentItem.type,
    usePreview: true,
    useFooter: true,
    sns: resolvedSns,
    pubDate: parsedContentItem.date,
    pubTime: parsedContentItem.time,
    instaTags: parsedContentItem.instaTags,
    mainImgUrl,
  }

  await askPublicationMenu(
    blogName,
    tgChat,
    state,
    validateContentPlanPost,
    tgChat.asyncCb(async () => {
      // TODO: не делать если poll
      // TODO: а нужно ли это тут делать???? или всетаки уже в fork ???
      const postTexts = makeTgPostTextFromNotion(
        state.sns,
        state.pubType,
        state.useFooter,
        tgChat.app.blogs[blogName].sn.telegram,
        pageBlocks,
        // TODO: это только для анонса
        state.replacedHtmlText,
        state.instaTags,
        parsedContentItem.tgTags,
      );

      let pollData: PollData | undefined;

      if (state.pubType === PUBLICATION_TYPES.poll) {

        // TODO: сформировать из notion

        pollData = {
          question: 'some question',
          options: ['1', '2'],
          isAnonymous: true,
          type: 'regular',
        };
      }

      // TODO: если poll - то подругому делать

      // TODO: сделать тексты для каждой соц сети
      const resultTextHtml = (state.replacedHtmlText)
        ? state.replacedHtmlText
        // TODO: сформировать правильный текст поста взависимости от типа
        : 'text'
      // TODO: do it
      const resultTextClear = 'clear text'
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
      ].includes(state.pubType))
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
        resultTextHtml
      )

      await tgChat.reply(makeContentPlanFinalDetails(
        blogName,
        tgChat,
        state,
        parsedContentItem,
      ))

      await askConfirm(tgChat, tgChat.asyncCb(async () => {
        try {
          // Do publish
          await publishFork(
            blogName,
            tgChat,
            state,
            parsedContentItem.type,
            postTexts,
            // it's for article only
            pageBlocks,
            // article title
            parsedContentItem.nameGist,
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
