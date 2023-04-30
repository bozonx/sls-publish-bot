import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';


const telegramPost: PackageIndex = (ctx: PackageContext) => {
  ctx.registerMenuItem()
}

export default telegramPost
