import TgChat from '../apiTg/TgChat';


export async function publishPollTg(
  tgChat: TgChat,
) {
  await tgChat.app.tg.bot.telegram.sendQuiz(
    tgChat.app.appConfig.logChannelId,
    'qqqquiz',
    [
      'opt 0',
      'opt 1',
      'opt 2',
      'opt 3',
    ],
    {
      is_anonymous: true,

      // for quiz
      correct_option_id: 1,
      explanation: 'errrrrr *bold* _ddf_',
      explanation_parse_mode: tgChat.app.appConfig.telegram.parseMode,

      // close_date of open_period
      // disable_notification
    }
  );


  await tgChat.app.tg.bot.telegram.sendPoll(
    tgChat.app.appConfig.logChannelId,
    'qqqq poll',
    [
      'opt 0',
      'opt 1',
      'opt 2',
      'opt 3',
    ],
    {
      is_anonymous: true,
      allows_multiple_answers: false,

      // close_date or open_period
      // disable_notification
    }
  )

}