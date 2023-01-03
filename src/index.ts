import * as fs from 'fs';
import yaml from 'js-yaml'
import App from './App';
import BlogsConfig from './types/BlogsConfig';
import dotenv from 'dotenv';


dotenv.config();

if (!process.env.CONFIG_PATH) {
  console.error(`You need to set env var CONFIG_PATH`);

  process.exit(1);
}

const conf = yaml.load(
  fs.readFileSync(process.env.CONFIG_PATH, 'utf8')
) as BlogsConfig
const app = new App(conf)

app.init()

// Enable graceful stop
process.once('SIGINT', () => app.destroy('SIGINT'));
process.once('SIGTERM', () => app.destroy('SIGTERM'));
