import {PackageIndex} from '../../types/types.js'
import {PackageContext} from '../../packageManager/PackageContext.js';


export default function telegramPost (): PackageIndex {
  return (ctx: PackageContext) => {

    console.log(111)

    ctx.registerMenuItem()
  }
}
