export interface ConfigChannel {
  name: string;
  dispname: string;
  id: string;
  notionRawPagesDbId: string;
}


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  channels: ConfigChannel[];
}
