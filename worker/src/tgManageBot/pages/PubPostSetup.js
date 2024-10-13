import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	defineMenu,
	calculateTextLengths,
	exscidedPostTextLimit,
} from '../helpers/helpers.js';
import { getLinksFromHtml } from '../helpers/converters.js';
import {
	createPost,
	printPubToAdminChannel,
} from '../helpers/publishHelpres.js';
import {
	TEMPLATE_NAMES,
	PUB_KEYS,
	DEFAULT_SETUP_STATE,
	USER_KEYS,
	TG_HOME_PAGE,
	EDIT_ITEM_NAME,
	CTX_KEYS,
	USER_CFG_KEYS,
} from '../constants.js';

export class PubPostSetup extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const links = getLinksFromHtml(this.state.pub[PUB_KEYS.textHtml]);

		this.state.pub = {
			...DEFAULT_SETUP_STATE,
			// set default author for default template - current user's author name
			[PUB_KEYS.author]:
				c.ctx[CTX_KEYS.me][USER_KEYS.cfg][USER_CFG_KEYS.authorName],
			...this.state.pub,
		};

		const pub = this.state.pub;
		const editMode = Boolean(this.state[EDIT_ITEM_NAME]);
		const hasMedia = Boolean(this.state.pub[PUB_KEYS.media]?.length);
		const [, fullPostLength] = calculateTextLengths(c, pub);
		const isFullPostExceeded = exscidedPostTextLimit(
			fullPostLength,
			pub[PUB_KEYS.media]?.length,
		);

		this.text = `${await makeStatePreview(c, pub)}\n\n${t(c, 'pubPostSetupDescr')}`;

		const restTemplateNames = Object.keys(TEMPLATE_NAMES).filter(
			(i) => i !== pub[PUB_KEYS.template],
		);
		// author name for button addAuthor
		const authorToAdd = this._getAuthorToAdd();

		return defineMenu([
			...restTemplateNames.map((tmplName) => [
				{
					id: 'TEMPLATE',
					label: `${t(c, 'useTemplateBtn')}: ` + t(c, `template-${tmplName}`),
					payload: tmplName,
				},
			]),
			!hasMedia &&
			links.length === 1 && [
				{
					id: `LINK_PREVIEW_SWITCH`,
					label: t(
						c,
						pub[PUB_KEYS.previewLink] === null
							? `linkPreviewOnBtn`
							: `linkPreviewOffBtn`,
					),
				},
			],
			!hasMedia &&
			links.length > 1 && [
				{
					id: `linkPreviewSelectBtn`,
					label: t(c, `linkPreviewSelectBtn`),
				},
			],
			pub[PUB_KEYS.previewLink] && [
				{
					id: `LINK_PREVIEW_PLACEMENT`,
					label: t(
						c,
						pub[PUB_KEYS.previewLinkOnTop]
							? 'linkPreviewToBottomBtn'
							: `linkPreviewToTopBtn`,
					),
				},
			],
			pub[PUB_KEYS.author]
				? [
					{
						id: 'withoutAuthorBtn',
						label: t(c, 'withoutAuthorBtn'),
					},
				]
				: authorToAdd && [
					{
						id: 'addAuthorBtn',
						label: `${t(c, 'addAuthorBtn')}: ${authorToAdd}`,
					},
				],
			!isFullPostExceeded && [
				{
					id: 'showPostBtn',
					label: t(c, 'showPostBtn'),
				},
			],
			!editMode &&
			!isFullPostExceeded && [
				{
					id: 'saveToConservedBtn',
					label: t(c, 'saveToConservedBtn'),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				!isFullPostExceeded &&
				(editMode
					? {
						id: 'saveBtn',
						label: t(c, 'saveBtn'),
					}
					: {
						id: 'nextBtn',
						label: t(c, 'nextBtn'),
					}),
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		const c = this.router.c;

		if (btnId === 'TEMPLATE') {
			return this.reload({
				[PUB_KEYS.template]: payload,
				[PUB_KEYS.author]: this._resolveAuthorByTemplate(payload),
			});
		}

		switch (btnId) {
			case 'addAuthorBtn':
				const authorToAdd = this._getAuthorToAdd();

				return this.reload({
					[PUB_KEYS.author]: authorToAdd,
					[PUB_KEYS.noAuthor]: false,
					[PUB_KEYS.customAuthor]: null,
				});
			case 'withoutAuthorBtn':
				return this.reload({
					[PUB_KEYS.author]: null,
					[PUB_KEYS.noAuthor]: true,
					[PUB_KEYS.customAuthor]: null,
				});
			case 'showPostBtn':
				await this.printFinalPost(this.me[USER_KEYS.tgChatId], this.state.pub);

				return this.reload();
			case 'LINK_PREVIEW_SWITCH':
				let previewLink = null;

				if (!this.state.pub[PUB_KEYS.previewLink]) {
					const links = getLinksFromHtml(this.state.pub[PUB_KEYS.textHtml]);

					previewLink = links[0] || null;
				}

				return this.reload({ [PUB_KEYS.previewLink]: previewLink });
			case 'LINK_PREVIEW_PLACEMENT':
				return this.reload({
					[PUB_KEYS.previewLinkOnTop]:
						!this.state.pub[PUB_KEYS.previewLinkOnTop],
				});
			case 'linkPreviewSelectBtn':
				return this.go('pub-select-preview');
			case 'saveToConservedBtn':
				const item = await createPost(c, this.state.pub, true);

				await printPubToAdminChannel(c, item);
				await this.reply(t(c, 'wasSuccessfullyConserved'));

				return this.go(TG_HOME_PAGE);
			case 'backBtn':
				return this.go('pub-tags');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME])
					return this.go(this.state.editReturnUrl);

				return this.go(TG_HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-date');
			case 'saveBtn':
				this.state.saveIt = true;

				return this.go(this.state.editReturnUrl);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const customAuthor = c.msg.text?.trim();

		if (!customAuthor) return;

		return this.reload({
			[PUB_KEYS.author]: customAuthor,
			[PUB_KEYS.noAuthor]: false,
			[PUB_KEYS.customAuthor]: customAuthor,
		});
	}

	_getAuthorToAdd() {
		if (
			[TEMPLATE_NAMES.gotFrom, TEMPLATE_NAMES.byFollower].includes(
				this.state.pub[PUB_KEYS.template],
			)
		)
			return this.state.pub[PUB_KEYS.forwardedFrom];

		return this.me[USER_KEYS.cfg][USER_CFG_KEYS.authorName];
	}

	_resolveAuthorByTemplate(testTemplate) {
		const customAuthor = this.state.pub[PUB_KEYS.customAuthor];
		const noAuthor = this.state.pub[PUB_KEYS.noAuthor];
		const forwardedFrom = this.state.pub[PUB_KEYS.forwardedFrom];

		if (
			!noAuthor &&
			[TEMPLATE_NAMES.gotFrom, TEMPLATE_NAMES.byFollower].includes(testTemplate)
		) {
			if (customAuthor) return customAuthor;
			else if (forwardedFrom) return forwardedFrom;
		} else if (!noAuthor && testTemplate === TEMPLATE_NAMES.default) {
			if (customAuthor) return customAuthor;
			// set me as an author
			else return this.me[USER_KEYS.cfg][USER_CFG_KEYS.authorName];
		}
		// template noFooter or other cases means no author name
		return null;
	}
}
