import {pathJoin} from 'squidlet-lib'
import {PackageContext} from './PackageContext'
import System from '../System';
import {PackageIndex} from '../types/types';


// TODO: только регистрация пакетов, а инициализация будет на каждого юзера своя

export class PackageManager {
  private readonly app
  readonly ctx


  constructor(app: System) {
    this.app = app
    this.ctx = new PackageContext(this.app)
  }


  async destroy() {
    // TODO: дестроить то на что пакеты навешались дестроить
  }

}
