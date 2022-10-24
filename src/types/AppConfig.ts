export interface ConfigChannel {
  channelId: string;
  name: string;
  dispname: string;
  notionRawPagesDbId: string;
  supportedTypes: number[];
}


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  channels: ConfigChannel[];
}
