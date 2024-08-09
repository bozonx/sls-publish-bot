import {AppBase} from 'squidlet'
import type {PackageIndex, PackageContext} from 'squidlet'
import {APP_NAME} from './lib/constants.js'


export function publisherAppPkg(): PackageIndex {
  return (ctx: PackageContext) => {
    ctx.useApp(PublisherAppIndex)
  }
}

export function PublisherAppIndex() {
  return new PublisherApp()
}

export class PublisherApp extends AppBase {
  myName = APP_NAME


  constructor() {
    super()
  }


  async init() {
    // this.ctx.registerAppUi(this.myName, [
    //   'main.js',
    //   'main.css',
    // ])
  }

}
