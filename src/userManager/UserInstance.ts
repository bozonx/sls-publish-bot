import {UserManager} from './UserManager.js';

export class UserInstance {
  userManager: UserManager


  constructor(userManager: UserManager) {
    this.userManager = userManager
  }

  async destroy() {

  }

}
