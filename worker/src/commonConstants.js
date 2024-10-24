export const POST_NAME_LENGTH = 40;
export const DB_TABLE_NAMES = {
	User: 'User',
	Workspace: 'Workspace',
	Blog: 'Blog',
	SocialMedia: 'SocialMedia',
	Tag: 'Tag',
	Post: 'Post',
};

export const USER_KEYS = {
	id: 'id',
	tgUserId: 'tgUserId',
	tgChatId: 'tgChatId',
	lang: 'lang',
	name: 'name',
	cfg: 'cfg',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
};
export const POST_KEYS = {
	id: 'id',
	type: 'type',
	name: 'name',
	descr: 'descr',
	pubDateTime: 'pubDateTime',
	payload: 'payload',
	pubData: 'pubData',
	author: 'author',
	blogId: 'blogId',
	socialMediaId: 'socialMediaId',
	referencePostId: 'referencePostId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
};
export const SM_KEYS = {
	id: 'id',
	type: 'type',
	name: 'name',
	descr: 'descr',
	cfg: 'cfg',
	tags: 'tags',
	orderNum: 'orderNum',
	blogId: 'blogId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
};

// common post payload
export const POST_PAYLOAD = {
	// raw text from form input
	// textMdV1Raw: 'textMdV1Raw',
	media: 'media',
	tags: 'tags',
	// social media's template
	template: 'template',
	// obviously do not use author
	noAuthor: 'noAuthor',
	// author name which has been inputted
	customAuthor: 'customAuthor',
};
