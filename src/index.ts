import _ from 'lodash';
import * as fs from 'fs';
import yaml from 'js-yaml'
import dotenv from 'dotenv';
import App from './App.js';
import BlogsConfig from './types/BlogsConfig.js';


dotenv.config();

if (!process.env.CONFIG_PATH) {
  console.error(`You need to set env var CONFIG_PATH`);

  process.exit(2);
}
else if (!process.env.CHANNEL_IDS) {
  console.error(`You need to set env var CHANNEL_IDS`);

  process.exit(2);
}

const confStr = fs.readFileSync(process.env.CONFIG_PATH, 'utf8')
const finalCfgString = _.template(confStr)({
  TAGS: '${ TAGS }',
  TITLE: '${ TITLE }',
  ARTICLE_URL: '${ ARTICLE_URL }',
  ...JSON.parse(process.env.CHANNEL_IDS),
})
const conf = yaml.load(finalCfgString) as BlogsConfig
const app = new App(conf)

app.init()

// Enable graceful stop
process.once('SIGINT', () => app.destroy('SIGINT'));
process.once('SIGTERM', () => app.destroy('SIGTERM'));
