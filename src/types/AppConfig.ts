export interface ConfigChannel {
  channelId: string;
  name: string;
  dispname: string;
  notionRawPagesDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
}


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  channels: ConfigChannel[];
}
