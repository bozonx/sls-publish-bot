export const TG_BOT_URL = '/bot';
export const KV_CONFIG = 'config';
export const KV_TAGS = 'tags';
export const APP_CONFIG_KEYS = {
	ALLOWED_USER_IDS: 'ALLOWED_USER_IDS',
	AUTHORS: 'AUTHORS',
	TEMPLATES: 'TEMPLATES',
};
export const TEMPLATE_NAMES = {
	default: 'default',
	byFollower: 'byFollower',
	noFooter: 'noFooter',
};
export const DEFAULT_STATE = {
	preview: true,
	template: TEMPLATE_NAMES.default,
};

const footer = '[Антифеминизм | Маскулизм. подписывайся]() | [донат]()';

export const APP_INITIAL_CONFIG = {
	[APP_CONFIG_KEYS.ALLOWED_USER_IDS]: [],
	[APP_CONFIG_KEYS.AUTHORS]: ['Айван Кей'],
	[APP_CONFIG_KEYS.TEMPLATES]: {
		[TEMPLATE_NAMES.common]: ['${CONTENT}', '${AUTHOR}', '${TAGS}', footer],
		[TEMPLATE_NAMES.byFollower]: [
			'От подписчика ${AUTHOR}:',
			'${CONTENT}',
			'${TAGS}',
			footer,
		],
		[TEMPLATE_NAMES.noFooter]: ['${CONTENT}', '${AUTHOR}', '${TAGS}'],
	},
};
