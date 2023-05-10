import {Main} from './Main.js';
import {TgBotConfig} from './types/TgBotConfig.js';
import {makeBotId} from '../../src/helpers/makeBotId.js';


const config: TgBotConfig = {
  // TODO: взять из env
  isProduction: false,
  debug: true,
}

const main = new Main(config)

main.init()

// Enable graceful stop
process.once('SIGINT', () => main.destroy('SIGINT'));
process.once('SIGTERM', () => main.destroy('SIGTERM'));

//////// TEST


const testBotToken = '2200624704:AAGH52SeJJLMGVBwK4cMkOnJxTMtLJRc1xM'


const uiFiles = ''
const botId = makeBotId(testBotToken)


// // когда пользователь создает бота
// main.registerBot(testBotToken, botId)
// // Когда пользователь создал бота, то записываем стандартный ui.
// // Если он внес правки, добавил/убрал какие-то плагины то тоже вызываем
// main.setUi(botId, uiFiles)

//main.telegramManager

// main.onCmdStart(testBotToken, (chatId: number | string) => {
//
// })
