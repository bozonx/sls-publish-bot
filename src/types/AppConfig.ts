export interface ConfigChannel {
  channelId: string;
  name: string;
  dispname: string;
  notionRawPagesDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
  sn: Record<any, Record<string, any>>;
}


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  // offset of UTC in hours - 3 means Moscow
  utcOffset: number;
  channels: ConfigChannel[];
}
