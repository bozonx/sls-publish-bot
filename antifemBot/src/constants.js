export const TG_BOT_URL = '/bot';
export const KV_CONFIG = 'config';
export const KV_TAGS = 'tags';
export const APP_CONFIG_KEYS = {
	ALLOWED_USER_IDS: 'ALLOWED_USER_IDS',
	AUTHORS: 'AUTHORS',
	TEMPLATES: 'TEMPLATES',
};

const footer = '[Антифеминизм | Маскулизм. подписывайся]() | [донат]()';

export const APP_INITIAL_CONFIG = {
	[APP_CONFIG_KEYS.ALLOWED_USER_IDS]: [],
	[APP_CONFIG_KEYS.AUTHORS]: ['Айван Кей'],
	[APP_CONFIG_KEYS.TEMPLATES]: {
		common: ['${CONTENT}', '${AUTHOR}', '${TAGS}', footer],
		byFollower: ['От подписчика ${AUTHOR}:', '${CONTENT}', '${TAGS}', footer],
		noFooter: ['${CONTENT}', '${AUTHOR}', '${TAGS}'],
	},
};
