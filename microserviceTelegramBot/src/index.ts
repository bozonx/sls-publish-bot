import {Main} from './Main.js';
import {TgBotConfig} from './types/TgBotConfig.js';


const config: TgBotConfig = {
  // TODO: взять из env
  isProduction: false,
  debug: true,
  testBotToken: '2200624704:AAGH52SeJJLMGVBwK4cMkOnJxTMtLJRc1xM',
}

const main = new Main(config)

main.init()

// Enable graceful stop
process.once('SIGINT', () => main.destroy('SIGINT'));
process.once('SIGTERM', () => main.destroy('SIGTERM'));
