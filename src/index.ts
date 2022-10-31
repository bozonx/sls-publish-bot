import dotenv from 'dotenv';
import App from './App';
import execConf from './execConfig';
import * as fs from 'fs';
import ExecConfig from './types/ExecConfig';


dotenv.config();


let conf: ExecConfig = execConf;

if (process.env.NODE_ENV === 'production' && !process.env.CONFIG_PATH) {
  console.error(`You need to set env var CONFIG_PATH in production mode`);

  process.exit(1);
}

if (process.env.CONFIG_PATH?.match(/\.json$/)) {
  conf = JSON.parse(
    fs.readFileSync(process.env.CONFIG_PATH).toString('utf-8')
  ) as ExecConfig;
}


const app = new App(conf);

app.init();

// Enable graceful stop
process.once('SIGINT', () => app.destroy('SIGINT'));
process.once('SIGTERM', () => app.destroy('SIGTERM'));
