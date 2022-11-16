export type TgReplyButton = TgReplyBtnCb | TgReplyBtnUrl;

export interface TgReplyBtnCb {
  text: string;
  callback_data: string;
}

export interface TgReplyBtnUrl {
  text: string;
  url: string;
}
