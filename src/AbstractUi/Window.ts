import {Router} from './Router.js';

/**
 * The singleton of whole UI
 */
export class Window {
  readonly router = new Router()


  async destroy() {
    await this.router.destroy()
  }
}
