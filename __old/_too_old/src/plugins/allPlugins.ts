// import telegramPost from './telegramPost/index.js';
// import telegramTasks from './telegramTasks/index.js';


import telegramRenderer from '../../microserviceTelegramBot/src/tg/index.js';


export const userPlugins = [
  telegramRenderer,
  // telegramPost,
  // telegramTasks,
]