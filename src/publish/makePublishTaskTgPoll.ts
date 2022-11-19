import TgChat from '../apiTg/TgChat';
import PollData from '../types/PollData';
import {registerPublishTaskTg} from './makePublishTaskTg';


export async function makePublishTaskTgPoll(
  isoDate: string,
  time: string,
  pollData: PollData,
  blogName: string,
  tgChat: TgChat,
) {
  let postMsgId: number;
  // Print to log channel
  try {
    if (pollData.type === 'quiz') {
      postMsgId = (await tgChat.app.tg.bot.telegram.sendQuiz(
        tgChat.app.appConfig.logChannelId,
        pollData.question,
        pollData.options,
        {
          is_anonymous: pollData.isAnonymous,
          correct_option_id: pollData.correctOptionId,
          explanation: pollData.explanation,
          explanation_parse_mode: tgChat.app.appConfig.telegram.parseMode,
        }
      )).message_id;
    }
    else {
      postMsgId = (await tgChat.app.tg.bot.telegram.sendPoll(
        tgChat.app.appConfig.logChannelId,
        pollData.question,
        pollData.options,
        {
          is_anonymous: pollData.isAnonymous,
          allows_multiple_answers: pollData.multipleAnswers,
        }
      )).message_id;
    }
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish poll to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, time, postMsgId, blogName, tgChat);
}
