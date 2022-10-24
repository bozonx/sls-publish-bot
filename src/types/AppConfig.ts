export interface ConfigChannel {
  name: string;
  dispname: string;
  id: string;
}


export default interface AppConfig {
  botToken: string;
  channels: ConfigChannel[];
}
