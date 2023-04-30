import {pathJoin} from 'squidlet-lib'
import {PackageContext} from './PackageContext.js'
import App from '../App.js';


export class PackageManager {
  private readonly app
  readonly ctx


  constructor(app: App) {
    this.app = app
    this.ctx = new PackageContext(this.app)
  }


  async destroy() {
    // TODO: дестроить то на что пакеты навешались дестроить
  }

  // TODO: наверное сделать отдельный дестрой для системных пакетов и пользовательских


  async loadInstalled() {
    // const appsDirContent = await this.filesDriver.readDir(pathJoin(ROOT_DIRS.appFiles))
    //
    // for (const appDir of appsDirContent) {
    //   const indexFilePath = pathJoin(ROOT_DIRS.appFiles, appDir, 'index.js')
    //   const indexFileContent = await this.filesDriver.readTextFile(indexFilePath)
    //
    //   // TODO: Что делать с зависимостями этого фала ???? сбилдить в 1 файл в require???
    //   // TODO: засунуть в sandbox
    //
    //   // TODO: должен ещё быть запущен init io, driver, service который предоставляет пакет
    // }
  }

  async install() {
    // TODO: add
  }

  async update() {
    // TODO: чтобы обновить пакет нужно понять что к нему относится
  }

  async uninstall() {
    // TODO: чтобы удалить пакет нужно понять что к нему относится
  }

}
