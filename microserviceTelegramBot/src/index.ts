import {Main} from './Main.js';
import {TgBotConfig} from './types/TgBotConfig.js';
import {ServiceInterface} from './ServiceInterface.js';


const config: TgBotConfig = {
  // TODO: взять из env
  isProduction: false,
  debug: true,
}

const main = new Main(config)
const service = new ServiceInterface(main)

main.init()

// Enable graceful stop
process.once('SIGINT', () => main.destroy('SIGINT'));
process.once('SIGTERM', () => main.destroy('SIGTERM'));



//////// TEST

(async () => {
  const testBotToken = '2200624704:AAGH52SeJJLMGVBwK4cMkOnJxTMtLJRc1xM'
  const uiFiles = 'compiled js files. They render menu and listen events'

  // когда пользователь создает бота
  const botId = await service.newBot(testBotToken)
  // Когда пользователь создал бота, то записываем стандартный ui.
  // Если он внес правки, добавил/убрал какие-то плагины то тоже вызываем
  await service.setUi(botId, uiFiles)

})()
