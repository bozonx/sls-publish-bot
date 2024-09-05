import { PubPageBase } from '../PubPageBase.js';
import {
	TEMPLATE_NAMES,
	PUB_KEYS,
	DEFAULT_SETUP_STATE,
	USER_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
} from '../constants.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { saveEditedScheduledPost } from '../publishHelpres.js';

export class PubPostSetup extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.state.pub = {
			...DEFAULT_SETUP_STATE,
			// set creator of the post
			[PUB_KEYS.createdBy]: c.ctx[CTX_KEYS.me][USER_KEYS.id],
			...this.state.pub,
		};

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'pubPostSetupDescr')}`;

		const restTemplateNames = Object.keys(TEMPLATE_NAMES).filter(
			(i) => i !== this.state.pub[PUB_KEYS.template],
		);
		const previewIsOn = Boolean(this.state.pub[PUB_KEYS.preview]);
		const authorToAdd = this._getAuthorToAdd();

		return defineMenu([
			...restTemplateNames.map((tmplName) => [
				{
					id: 'TEMPLATE',
					label: `${t(c, 'useTemplateBtn')}: ` + t(c, `template-${tmplName}`),
					payload: tmplName,
				},
			]),
			!this.state.pub[PUB_KEYS.media]?.length && [
				{
					id: `linkPreviewSwitch`,
					label: t(c, previewIsOn ? `linkPreviewOffBtn` : `linkPreviewOnBtn`),
					payload: Number(!previewIsOn),
				},
			],
			this.state.pub[PUB_KEYS.noAuthor]
				? authorToAdd && [
					{
						id: 'addAuthorBtn',
						label: `${t(c, 'addAuthorBtn')}: ${authorToAdd}`,
						// payload: authorToAdd,
					},
				]
				: [
					{
						id: 'withoutAuthorBtn',
						label: t(c, 'withoutAuthorBtn'),
					},
				],
			[
				{
					id: 'showPreviewBtn',
					label: t(c, 'showPreviewBtn'),
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
				this.state[EDIT_ITEM_NAME]
					? {
						id: 'saveBtn',
						label: t(c, 'saveBtn'),
					}
					: {
						id: 'nextBtn',
						label: t(c, 'nextBtn'),
					},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'TEMPLATE') {
			return this.reload({ [PUB_KEYS.template]: payload });
		}

		switch (btnId) {
			case 'addAuthorBtn':
				return this.reload({ [PUB_KEYS.noAuthor]: false });
			case 'withoutAuthorBtn':
				return this.reload({
					[PUB_KEYS.noAuthor]: true,
					[PUB_KEYS.customAuthor]: null,
				});
			case 'showPreviewBtn':
				await this.printFinalPost(this.me[USER_KEYS.id], this.state.pub);

				return this.reload();
			case 'linkPreviewSwitch':
				return this.reload({ [PUB_KEYS.preview]: Boolean(payload) });
			case 'backBtn':
				return this.go('pub-tags');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME]) return this.go('scheduled-item');

				return this.go(HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-date');
			case 'saveBtn':
				return saveEditedScheduledPost(this.router);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const author = c.msg.text?.trim();

		if (!author) return;

		return this.reload({ [PUB_KEYS.customAuthor]: author });
	}

	_getAuthorToAdd() {
		return this.state.pub[PUB_KEYS.template] === TEMPLATE_NAMES.byFollower
			? this.state.pub[PUB_KEYS.forwardedFrom]
			: this.me[USER_KEYS.authorName];
	}
}
