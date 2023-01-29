import TgChat from '../../apiTg/TgChat.js';
import {SnType} from '../../types/snTypes.js';
import ContentItem from '../../types/ContentItem.js';
import RawPageContent from '../../types/PageContent.js';
import {askPublicationMenu, PublishMenuState} from './askPublicationMenu.js';
import {printImage, printPublishConfirmData} from '../../publish/printInfo.js';
import {makeClearTextFromNotion} from '../../helpers/makeClearTextFromNotion.js';
import validateContentPlanPost, {validateContentPlanPostText} from '../../publish/validateContentPlanPost.js';
import {WARN_SIGN} from '../../types/constants.js';
import {askConfirm} from '../common/askConfirm.js';
import {makeTgPostTextFromNotion} from '../../helpers/makeTgPostTextFromNotion.js';
import PollData from '../../types/PollData.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {publishFork} from '../../publish/publishFork.js';


export async function startPublicationMenu(
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

  await askPublicationMenu(blogName, tgChat, state, tgChat.asyncCb(async () => {
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
