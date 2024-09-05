// got from https://github.com/tgsnake/parser/blob/main/src/Parser.ts

import { Entities } from './Entities.js';
// import { parse as MDParser } from './markdown.ts';
// import { parse as HTMLParser } from './html.ts';
// import ParserError from './ParserError.ts';
// import { Raw } from './platform.deno.ts';

// export function parse(text, parseMode) {
// 	try {
// 		if (text === '') {
// 			return [text, []];
// 		}
// 		if (parseMode === 'markdown') {
// 			return MDParser(text);
// 		}
// 		if (parseMode === 'html') {
// 			return HTMLParser(text);
// 		}
// 		return [text, []];
// 	} catch (error) {
// 		throw new ParserError(
// 			error.message,
// 			'Parser error when parsing message.',
// 			500,
// 			'Parser.parse',
// 		);
// 	}
// }

export function fromRaw(entities) {
	let tmp = [];
	for (let ent of entities) {
		if (ent instanceof Raw.MessageEntityMention) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'mention',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityHashtag) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'hashtag',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityBotCommand) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'botCommand',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityUrl) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'url',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityEmail) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'email',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityBold) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'bold',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityItalic) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'italic',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityCode) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'code',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityPre) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					language: ent.language,
					type: 'pre',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityTextUrl) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					url: ent.url,
					type: 'textUrl',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityMentionName) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					userId: BigInt(String(ent.userId)),
					type: 'mentionName',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityPhone) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'phone',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityCashtag) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'cashtag',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityUnderline) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'underline',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityStrike) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'strike',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityBlockquote) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'blockquote',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityBankCard) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'bankCard',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntitySpoiler) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					type: 'spoiler',
				}),
			);
			continue;
		}
		if (ent instanceof Raw.MessageEntityCustomEmoji) {
			ent;
			tmp.push(
				new Entities({
					offset: ent.offset,
					length: ent.length,
					emojiId: ent.documentId,
					type: 'customEmoji',
				}),
			);
		}
	}
	return tmp;
}
export async function toRaw(client, entities) {
	if (!client) {
		throw new ParserError(
			`Client not found!`,
			`Plase make sure you set the client. eg : Parser.fromRaw(client,entities).`,
			404,
			'Parser.fromRaw',
		);
	}
	let tmp = [];
	for (let ent of entities) {
		switch (ent.type) {
			case 'mention':
				tmp.push(
					new Raw.MessageEntityMention({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'hashtag':
				tmp.push(
					new Raw.MessageEntityHashtag({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'botCommand':
				tmp.push(
					new Raw.MessageEntityBotCommand({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'url':
				tmp.push(
					new Raw.MessageEntityMention({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'email':
				tmp.push(
					new Raw.MessageEntityEmail({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'bold':
				tmp.push(
					new Raw.MessageEntityBold({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'italic':
				tmp.push(
					new Raw.MessageEntityItalic({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'code':
				tmp.push(
					new Raw.MessageEntityCode({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'pre':
				tmp.push(
					new Raw.MessageEntityPre({
						offset: ent.offset,
						length: ent.length,
						language: ent.language,
					}),
				);
				break;
			case 'textUrl':
				tmp.push(
					new Raw.MessageEntityTextUrl({
						offset: ent.offset,
						length: ent.length,
						url: ent.url,
					}),
				);
				break;
			case 'mentionName':
				const peer = await client.resolvePeer(ent.userId);
				tmp.push(
					new Raw.InputMessageEntityMentionName({
						offset: ent.offset,
						length: ent.length,
						userId: await getInputUser(peer),
					}),
				);
				break;
			case 'phone':
				tmp.push(
					new Raw.MessageEntityPhone({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'cashtag':
				tmp.push(
					new Raw.MessageEntityCashtag({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'underline':
				tmp.push(
					new Raw.MessageEntityUnderline({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'strike':
				tmp.push(
					new Raw.MessageEntityStrike({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'blockquote':
				tmp.push(
					new Raw.MessageEntityBlockquote({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'bankCard':
				tmp.push(
					new Raw.MessageEntityBankCard({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'spoiler':
				tmp.push(
					new Raw.MessageEntitySpoiler({
						offset: ent.offset,
						length: ent.length,
					}),
				);
				break;
			case 'customEmoji':
				tmp.push(
					new Raw.MessageEntityCustomEmoji({
						offset: ent.offset,
						length: ent.length,
						documentId: ent.emojiId,
					}),
				);
				break;
			default:
		}
	}
	return tmp;
}

function getInputUser(peer) {
	if (peer instanceof Raw.InputPeerUser) {
		return new Raw.InputUser({
			userId: peer.userId,
			accessHash: peer.accessHash,
		});
	}
	if (peer instanceof Raw.InputPeerSelf) {
		return new Raw.InputUserSelf();
	}
	return new Raw.InputUserEmpty();
}
