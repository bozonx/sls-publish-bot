import * as fs from 'fs';
import yaml from 'js-yaml'
import dotenv from 'dotenv';
import App from './App.js';
import BlogsConfig from './types/BlogsConfig.js';


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
