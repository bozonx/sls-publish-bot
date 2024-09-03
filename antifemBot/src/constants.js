// for webhook
export const TG_BOT_URL = '/bot';
export const CACHE_PREFIX = 'CACHE';
export const QUERY_MARKER = 'PageRouter';
export const DATE_FORMAT = 'YYYY-MM-DD';
// TODO: вынести в env?
export const SESSION_STATE_TTL_SEC = 80;
// TODO: вынести в env?
export const PUBLISHING_MINUS_MINUTES = 5;
// TODO: вынести в env?
export const PUBLICATION_TIME_ZONE = '+03:00';
export const PUBLICATION_ADD_NOW_SEC = 5;
export const USER_SENT_TO_ADMIN_MSG_DELIMITER = '-----';
export const HOME_PAGE = 'home';
export const KV_KEYS = {
	config: 'config',
	users: 'users',
	tags: 'tags',
	scheduled: 'scheduled',
};
export const CTX_KEYS = {
	// it is c.msg.chat.id
	chatWithBotId: 'chatWithBotId',
	config: 'config',
	users: 'users',
	// user object from DB
	me: 'me',
	KV: 'KV',
	CHAT_OF_ADMINS_ID: 'CHAT_OF_ADMINS_ID',
	DESTINATION_CHANNEL_ID: 'DESTINATION_CHANNEL_ID',
};
export const USER_KEYS = {
	id: 'id',
	name: 'name',
	isAdmin: 'isAdmin',
	authorName: 'authorName',
};
export const APP_CFG_KEYS = {
	authors: 'authors',
	templates: 'templates',
};
export const TEMPLATE_NAMES = {
	default: 'default',
	byFollower: 'byFollower',
	noFooter: 'noFooter',
};
export const PUB_KEYS = {
	text: 'text',
	entities: 'entities',
	media: 'media',
	author: 'author',
	tags: 'tags',
	template: 'template',
	preview: 'preview',
	date: 'date',
	time: 'time',
	publisher: 'publisher',
};
export const MEDIA_TYPES = {
	photo: 'photo',
	video: 'video',
};

export const DEFAULT_SETUP_STATE = {
	[PUB_KEYS.preview]: true,
	[PUB_KEYS.template]: TEMPLATE_NAMES.default,
};

const footer =
	'[Антифеминизм \\| Маскулизм\\. подписывайся](https://t.me/antifem_battle) \\| [донат](https://t.me/antifem_battle/78)';

export const APP_INITIAL_CONFIG = {
	[APP_CFG_KEYS.authors]: ['Айван Кей'],
	// use telegram MarkdownV2 https://core.telegram.org/bots/api#markdownv2-style
	[APP_CFG_KEYS.templates]: {
		[TEMPLATE_NAMES.default]: ['${CONTENT}', '${AUTHOR}', '${TAGS}', footer],
		[TEMPLATE_NAMES.byFollower]: [
			'От подписчика ${AUTHOR}:',
			'${CONTENT}',
			'${TAGS}',
			footer,
		],
		[TEMPLATE_NAMES.noFooter]: ['${CONTENT}', '${AUTHOR}', '${TAGS}'],
	},
};
