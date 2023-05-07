import {PackageIndex} from '../../types/types.js';
import {PackageContext} from '../../packageManager/PackageContext.js';
import {TelegramRenderer} from './TelegramRenderer.js';


const telegramRenderer: PackageIndex = (ctx: PackageContext) => {
  const renderer = new TelegramRenderer(ctx)

  // TODO: what on destroy???
}

export default telegramRenderer
