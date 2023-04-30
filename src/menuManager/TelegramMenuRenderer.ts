import App from '../App.js';


export class TelegramMenuRenderer {
  private readonly app


  constructor(app: App) {
    this.app = app
  }

  async init() {
    await this.renderMenu()
  }


  private async renderMenu() {
    for (const item of this.app.menu.currentMenu) {
      const itemView = item.render()
    }
  }

}
