import Tg from "./Tg";
import AppConfig from "./types/AppConfig";
import config from "./config";


export default class App {
    public readonly config: AppConfig;
    public readonly tg: Tg;


    constructor() {
        this.config = this.makeConf();
        this.tg = new Tg();
    }


    async init() {

    }

    
    private makeConf(): AppConfig {
        return config;
    }

}
