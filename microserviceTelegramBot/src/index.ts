import {Main} from './Main.js';
import {TgBotConfig} from './types/TgBotConfig.js';


const config: TgBotConfig = {
  // TODO: взять из env
  isProduction: false,
  testBotToken: '2200624704:AAGH52SeJJLMGVBwK4cMkOnJxTMtLJRc1xM',
}

const main = new Main(config)

main.init()
