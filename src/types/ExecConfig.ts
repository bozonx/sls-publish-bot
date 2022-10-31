import exp from 'constants';

export interface ConfigChannel {
  channelId: number | string;
  name: string;
  dispname: string;
  notionContentPlanDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
  sn: {
    telegram: {
      telegraPhAuthorName: string;
      telegraPhAuthorUrl: string;
    };
    instagram: {

    };
    zen: {

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
