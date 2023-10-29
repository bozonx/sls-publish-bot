import path from 'node:path';
import _ from 'lodash';
import * as fs from 'fs';
import yaml from 'js-yaml'
import dotenv from 'dotenv';
import System from './System';
import BlogsConfig from './types/BlogsConfig';
import {systemPlugins} from './systemPlugins';
import {userPlugins} from './plugins/allPlugins';


dotenv.config();

if (!process.env.CONFIG_PATH) {
  console.error(`You need to set env var CONFIG_PATH`);

  process.exit(2);
}
else if (!process.env.CHANNEL_IDS) {
  console.error(`You need to set env var CHANNEL_IDS`);

  process.exit(2);
}

// const confStr = fs.readFileSync(process.env.CONFIG_PATH, 'utf8')
// const finalCfgString = _.template(confStr)({
//   TAGS: '${ TAGS }',
//   TITLE: '${ TITLE }',
//   ARTICLE_URL: '${ ARTICLE_URL }',
//   ...JSON.parse(process.env.CHANNEL_IDS),
// })
// const conf = yaml.load(finalCfgString) as BlogsConfig


(async () => {
  // const packages: string[] = [
  //   ...((process.env.PACKAGES) ? JSON.parse(process.env.PACKAGES) : []),
  // ]

  const system = new System()

  for (const sysPlugin of systemPlugins) {
    system.use(sysPlugin)
  }

  // TODO: подгужать их другим способом
  for (const sysPlugin of userPlugins) {
    system.use(sysPlugin)
  }

  // for (const packagePath of packages) {
  //   const pkg: {default: PackageIndex} = await import(path.resolve(packagePath + '/index.js'))
  //
  //   app.use(pkg.default)
  // }

  system.init()

  // Enable graceful stop
  process.once('SIGINT', () => system.destroy('SIGINT'));
  process.once('SIGTERM', () => system.destroy('SIGTERM'));
})()

