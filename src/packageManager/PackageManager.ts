import {pathJoin} from 'squidlet-lib'
import {PackageContext} from './PackageContext.js'
import App from '../App.js';
import {PackageIndex} from '../types/types.js';


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

}
