import TgChat from '../../apiTg/TgChat.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import {askContentToUse} from './askContentToUse.js';
import {prepareContentItem} from '../../publish/parseContent.js';
import ContentItem from '../../types/ContentItem.js';
import {preparePage} from '../../publish/parsePage.js';
import {askPublishMenu, PublishMenuState} from './askPublishMenu.js';
import {loadNotPublished} from '../../notionRequests/contentPlan.js';
import {publishFork} from '../../publish/publishFork.js';
import {loadPageBlocks} from '../../notionRequests/pageBlocks.js';
import {loadPageProps} from '../../notionRequests/pageProps.js';
import RawPageContent from '../../types/PageContent.js';
import {resolveSns} from '../../helpers/helpers.js';
import {getFirstImageFromNotionBlocks,} from '../../publish/publishHelpers.js';
import {askConfirm} from '../common/askConfirm.js';
import {printImage, printItemDetails, printPublishConfirmData} from '../../publish/printInfo.js';
import {WARN_SIGN} from '../../types/constants.js';
import validateContentPlanPost, {validateContentPlanPostText} from '../../publish/validateContentPlanPost.js';
import {makeClearTextFromNotion} from '../../helpers/makeClearTextFromNotion.js';
import {makeTgPostTextFromNotion} from '../../helpers/makeTgPostTextFromNotion.js';
import {SnType} from '../../types/snTypes.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import PollData from '../../types/PollData.js';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  let notPublishedItems: PageObjectResponse[]

  try {
    // load not published records from content plan
    notPublishedItems = await loadNotPublished(blogName,tgChat)
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
    await tgChat.steps.back()

    return
  }

  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    let parsedContentItem;
    let parsedPage;

    try {
      parsedContentItem = prepareContentItem(item, tgChat.app.i18n);
      parsedPage = await loadAndPreparePage(parsedContentItem, blogName, tgChat);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);
      await tgChat.steps.back();

      return;
    }

    if (!parsedPage && parsedContentItem.type !== PUBLICATION_TYPES.announcement) {
      // if not nested page and it isn't announcement
      await tgChat.reply(tgChat.app.i18n.errors.noNestedPage);
      await tgChat.steps.back();

      return;
    }

    const blogSns = Object.keys(tgChat.app.blogs[blogName].sn) as SnType[];
    const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type);

    // TODO: не нужно если poll

    const clearTexts = makeClearTextFromNotion(
      resolvedSns,
      parsedContentItem.type,
      true,
      tgChat.app.blogs[blogName].sn.telegram,
      parsedPage?.textBlocks,
      parsedContentItem.gist,
      parsedPage?.instaTags,
      parsedPage?.tgTags
    );
    let mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);

    mainImgUrl = await printImage(tgChat, mainImgUrl);

    // TODO: учитывать poll
    await printItemDetails(blogName, tgChat, clearTexts, resolvedSns, parsedContentItem, parsedPage);
    await askMenu(blogName, tgChat, resolvedSns, parsedContentItem, parsedPage, mainImgUrl);
  }));
}


async function loadAndPreparePage(
  parsedContentItem: ContentItem,
  blogName: string,
  tgChat: TgChat
): Promise<RawPageContent | undefined> {
  if (!parsedContentItem.relativePageId) return;
  // load props of page from notion
  const pageProperties = await loadPageProps(parsedContentItem.relativePageId, tgChat);
  // load all the page blocks from notion
  const pageContent = await loadPageBlocks(parsedContentItem.relativePageId, tgChat);

  return preparePage(parsedContentItem.type, pageProperties, pageContent, tgChat.app.i18n);
}

async function askMenu(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnType[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string,
) {
  const state: PublishMenuState = {
    pubType: parsedContentItem.type,
    usePreview: true,
    useFooter: true,
    sns: resolvedSns,
    selectedDate: parsedContentItem.date,
    selectedTime: parsedContentItem.time,
    instaTags: parsedPage?.instaTags,
    mainImgUrl,
  };

  await askPublishMenu(blogName, tgChat, state, tgChat.asyncCb(async () => {
    state.mainImgUrl = await printImage(tgChat, mainImgUrl);

    const clearTexts = makeClearTextFromNotion(
      state.sns,
      state.pubType,
      state.useFooter,
      tgChat.app.blogs[blogName].sn.telegram,
      parsedPage?.textBlocks,
      state.postMdText,
      state.instaTags,
      parsedPage?.tgTags,
    );

    // TODO: учитывать poll
    await printPublishConfirmData(blogName, tgChat, state, clearTexts, parsedPage);
    // TODO: может проще делать steps.back() ????
    let disableOk = false;

    try {
      // TODO: учитывать poll
      // TODO: валидировать textBlocks + title. Только если статья
      // TODO: валидация анонса - норм MD, должен иметь ссылку на статью
      validateContentPlanPost(state, tgChat);
      // TODO: учитывать poll
      validateContentPlanPostText(clearTexts, parsedContentItem.type, tgChat);
    }
    catch (e) {
      await tgChat.reply(`${WARN_SIGN} ${e}`);

      disableOk = true;
    }

    await askConfirm(tgChat, tgChat.asyncCb(async () => {
      try {
        // TODO: не делать если poll
        // TODO: а нужно ли это тут делать???? или всетаки уже в fork ???
        const postTexts = makeTgPostTextFromNotion(
          state.sns,
          state.pubType,
          state.useFooter,
          tgChat.app.blogs[blogName].sn.telegram,
          parsedPage?.textBlocks,
          state.postMdText,
          state.instaTags,
          parsedPage?.tgTags,
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
          parsedPage?.textBlocks,
          parsedPage?.title,
          parsedPage?.tgTags,
          parsedPage?.announcement,
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
    }), tgChat.app.i18n.commonPhrases.publishConfirmation, disableOk);
  }));
}
