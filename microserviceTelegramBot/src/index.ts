import path from 'path';
import {Main} from './Main.js';
import {TgBotConfig} from './types/TgBotConfig.js';
import {ServiceInterface} from './ServiceInterface.js';
import {DevServer} from '../../__old/src/callMicroService/DevServer.js';
import {DevClient} from '../../__old/src/callMicroService/DevClient.js';


const config: Partial<TgBotConfig> = {
  longStoragePath: path.resolve('./_testData/long'),
  varStoragePath: path.resolve('./_testData/var'),
  debug: true,
}

const main = new Main(config)
const service = new ServiceInterface(main)


// Enable graceful stop
process.once('SIGINT', () => main.destroy('SIGINT'));
process.once('SIGTERM', () => main.destroy('SIGTERM'));



//////// TEST

(async () => {
  await main.init()

  const devServer = new DevServer(service.receiverFromClient)


  const clientReceiver = (functionName: string, ...args: any[]) => {
    console.log(4444, functionName, ...args)
  }

  const devClient = new DevClient(clientReceiver, devServer)


  const testBotToken = '2200624704:AAGH52SeJJLMGVBwK4cMkOnJxTMtLJRc1xM'
  const uiFiles = 'compiled js files. They render menu and listen events'


  // TODO: лучше делать через proxy

  await devClient.send('newBot', testBotToken)


  // // когда пользователь создает бота
  // const botId = await service.newBot(testBotToken)
  // // Когда пользователь создал бота, то записываем стандартный ui.
  // // Если он внес правки, добавил/убрал какие-то плагины то тоже вызываем
  // await service.setUi(botId, uiFiles)

})()
