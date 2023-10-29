import {UserManager} from './UserManager';
import TasksMain from '../taskManager/TasksMain';
import {UiManager} from '../uiManager/UiManager';
import {Route} from '../../../squidlet-ui-builder/src/AbstractUi/interfaces/Route.js';
import {Screen} from '../../../squidlet-ui-builder/src/AbstractUi/Screen.js';
import {homeScreenDefinition} from '../uiManager/homeScreenDefinition';


export class UserInstance {
  userManager: UserManager
  readonly tasks: TasksMain;
  readonly uiManager = new UiManager(this)
  // to collect routes from packages after start and before init
  routes: Route[] = []
  // TODO: сделать это через отдельный класс, который будет сортировать ф-и инициализации
  // the queue of packages to init
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []
  // the queue of packages to destroy
  private destroyQueue: {cb: () => Promise<void>, before?: string[]}[] = []

  // TODO: у юзера могут быть свои пакеты
  // TODO: у юзера могут быть свои роуты

  constructor(userManager: UserManager) {
    this.userManager = userManager
    this.tasks = new TasksMain(this)

    // TODO: это перенести в юзера, так как будет перевод на язык юзера
    this.routes.push({
      path: '/',
      screen: new Screen(homeScreenDefinition)
    })
  }

  async init() {
    await this.tasks.init()

  }

  async destroy() {
    await this.tasks.destroy();
  }



  registerRoute(route: Route) {
    this.routes.push(route)
  }

  onUserInit(cb: () => Promise<void>, after?: string[]) {
    this.initQueue.push({
      cb,
      after
    })
  }

  onUserDestroy(cb: () => Promise<void>, before?: string[]) {
    this.destroyQueue.push({
      cb,
      before
    })
  }

}
