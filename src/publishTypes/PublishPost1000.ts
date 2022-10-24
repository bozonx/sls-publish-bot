import App from "../App";
import PublishHelper from "./PublishHelper";


export default class PublishPost1000 {
  private readonly app: App;
  private readonly publishHelper: PublishHelper;


  constructor(app: App) {
    this.app = app;
    this.publishHelper = new PublishHelper(this.app);
  }


  async start(channelId: number, menuAction: string) {

    console.log(1111, channelId, menuAction)
  }

}
