import System from '../System.js';
import {UserInstance} from './UserInstance.js';


export class UserManager {
  private system: System
  private users: Record<string, UserInstance> = {}


  constructor(system: System) {
    this.system = system
  }

  async destroy() {
    for (const userId of Object.keys(this.users)) {
      await this.users[userId].destroy()

      delete this.users[userId]
    }
  }


  newUser(userId: string): UserInstance {
    const user = new UserInstance(this)

    this.users[userId] = user

    return user
  }

}
