import App from "../App";
import PublishHelper from "./PublishHelper";


export default class PublishStory {
  private readonly app: App;
  private readonly publishHelper: PublishHelper;


  constructor(app: App) {
    this.app = app;
    this.publishHelper = new PublishHelper(this.app);
  }


  async start(channelId: number) {

    console.log(1111, channelId)
  }

}
