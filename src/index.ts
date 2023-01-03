import * as fs from 'fs';
import yaml from 'js-yaml'
import App from './App';
import ExecConfig from './types/ExecConfig';


if (!process.env.CONFIG_PATH) {
  console.error(`You need to set env var CONFIG_PATH`);

  process.exit(1);
}

const conf = yaml.load(
  fs.readFileSync(process.env.CONFIG_PATH, 'utf8')
) as ExecConfig
const app = new App(conf)

app.init();

// Enable graceful stop
process.once('SIGINT', () => app.destroy('SIGINT'));
process.once('SIGTERM', () => app.destroy('SIGTERM'));
