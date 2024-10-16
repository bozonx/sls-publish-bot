export const DB_TABLE_NAMES = {
	User: 'User',
	Workspace: 'Workspace',
	Blog: 'Blog',
	SocialMedia: 'SocialMedia',
	Tag: 'Tag',
	Post: 'Post',
};

export const CTX_KEYS = {
	// session state from db
	session: 'session',
	// user object from DB
	me: 'me',
	KV: 'KV',
	DB_CRUD: 'DB_CRUD',
	WEB_APP_URL: 'WEB_APP_URL',
	BOT_SESSION_TTL_DAYS: 'BOT_SESSION_TTL_DAYS',
	APP_DEBUG: 'APP_DEBUG',
	TEST_MODE: 'TEST_MODE',
};

export const USER_KEYS = {
	id: 'id',
	tgUserId: 'tgUserId',
	tgChatId: 'tgChatId',
	name: 'name',
	cfg: 'cfg',
	lang: 'lang',
};
export const POST_KEYS = {
	id: 'id',
	name: 'name',
	// time of real publication
	pubTimestampMinutes: 'pubTimestampMinutes',
	// data of publicated item such as message_id
	publicatedData: 'publicatedData',
	payloadJson: 'payloadJson',
	createdByUserId: 'createdByUserId',
	updatedByUserId: 'updatedByUserId',
	forcePublishedByUserId: 'forcePublishedByUserId',
	changedTimeByUserId: 'changedTimeByUserId',
	socialMediaId: 'socialMediaId',
};
export const SM_KEYS = {
	id: 'id',
	name: 'name',
	cfg: 'cfg',
	blog: 'blog',
};
export const TAG_KEYS = {
	id: 'id',
	name: 'name',
	socialMediaId: 'socialMediaId',
	blogId: 'blogId',
};

// common post payload
export const POST_PAYLOAD = {
	// raw text from form input
	textMdV1Raw: 'textMdV1Raw',
	media: 'media',
	tags: 'tags',
	template: 'template',
	// the final selected author
	author: 'author',
	// obviously do not use author
	noAuthor: 'noAuthor',
	// author name which has been inputted
	customAuthor: 'customAuthor',
	date: 'date',
	time: 'time',
};
