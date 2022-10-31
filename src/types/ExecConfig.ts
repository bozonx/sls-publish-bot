// Development config

export interface ConfigChannel {
  //name: string;
  dispname: string;
  notionContentPlanDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
  sn: {
    telegram?: {
      telegraPhAuthorName: string;
      telegraPhAuthorUrl: string;
      channelId: number | string;
    };
    instagram?: {
    };
    zen?: {
    };
    site?: {
    };
  };
}

export default interface ExecConfig {
  botToken: string;
  notionToken: string;
  telegraPhToken: string;
  logChannelId: number | string;
  channels: ConfigChannel[];
}
