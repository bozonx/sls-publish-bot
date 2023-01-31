import TgChat from '../../apiTg/TgChat.js';
import {SnType} from '../../types/snTypes.js';
import ContentItem from '../../types/ContentItem.js';
import {askPublicationMenu} from './askPublicationMenu.js';
import {printImage, printPublishConfirmData} from '../../publish/printContentItemInfo.js';
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


export interface PublishMenuState {
  pubType: PublicationType
  useFooter: boolean
  usePreview: boolean
  sns: SnType[]
  pubDate: string
  pubTime: string
  instaTags?: string[]
  mainImgUrl?: string
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
  footerTmplMd?: string
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
  };

  await askPublicationMenu(
    blogName,
    tgChat,
    state,
    validateContentPlanPost,
    tgChat.asyncCb(async () => {
      state.mainImgUrl = await printImage(tgChat, mainImgUrl)

      // TODO: почему здесь ???
      // const clearTexts = makeClearTextsFromNotion(
      //   state.sns,
      //   state.pubType,
      //   state.useFooter,
      //   tgChat.app.blogs[blogName].sn.telegram,
      //   pageBlocks,
      //   // TODO: это только для анонса
      //   state.replacedHtmlText,
      //   state.instaTags,
      //   parsedContentItem.tgTags,
      // );

      // TODO: add url button - к посту

      // TODO: учитывать poll
      await printPublishConfirmData(blogName, tgChat, state, parsedContentItem.tgTags, pageBlocks, undefined)
      // TODO: может проще делать steps.back() ????
      //let disableOk = false;

      // try {
      //   // TODO: учитывать poll
      //   // TODO: валидировать textBlocks + title. Только если статья
      //   // TODO: валидация анонса - норм MD, должен иметь ссылку на статью
      //   validateContentPlanPost(state, tgChat);
      //   // TODO: учитывать poll
      //   // TODO: сделать
      //   //validateContentPlanPostText(clearTexts, parsedContentItem.type, tgChat);
      // }
      // catch (e) {
      //   await tgChat.reply(`${WARN_SIGN} ${e}`);
      //
      //   disableOk = true;
      // }

      await askConfirm(tgChat, tgChat.asyncCb(async () => {
        try {
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

          // Do publish
          await publishFork(
            blogName,
            tgChat,
            state,
            parsedContentItem.type,
            postTexts,
            pageBlocks,
            // TODO: учитывать что не gist
            parsedContentItem.name,
            parsedContentItem.tgTags,
            // TODO: чо за хуйня
            //parsedPage?.announcement,
            undefined,
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
