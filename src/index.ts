import App from "./App";


const app = new App();

app.init()
  .catch((e) => {throw e});

// Enable graceful stop
process.once('SIGINT', () => app.tg.bot.stop('SIGINT'));
process.once('SIGTERM', () => app.tg.bot.stop('SIGTERM'));
