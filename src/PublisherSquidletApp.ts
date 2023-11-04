import {AppBase} from 'squidlet'
import type {PackageIndex, PackageContext} from 'squidlet'


export function publisherAppPkg(): PackageIndex {
  return (ctx: PackageContext) => {
    ctx.useApp(PublisherAppIndex)
  }
}

export function PublisherAppIndex() {
  return new PublisherApp()
}

export class PublisherApp extends AppBase {
  myName = 'Publisher'


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
