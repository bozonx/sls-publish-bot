import { PubPageBase } from '../PubPageBase.js';
import {
	PUB_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	USER_KEYS,
} from '../constants.js';
import { t, defineMenu, makeStatePreview } from '../helpers.js';
import {
	makeStateFromMessage,
	saveEditedScheduledPost,
} from '../publishHelpres.js';
import { isEmptyObj } from '../lib.js';

const REPLACE_MODES = {
	textOnly: 'textOnly',
	mediaOnly: 'mediaOnly',
	both: 'both',
};

export class PubContent extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		if (!this.state.pub) this.state.pub = {};
		// copy state to edit in edit mode
		if (this.state[EDIT_ITEM_NAME] && isEmptyObj(this.state.pub))
			this.state.pub = this.state[EDIT_ITEM_NAME];
		// set initial replace mode = both
		if (!this.state.replaceMode) this.state.replaceMode = REPLACE_MODES.both;

		const haveAnyContent = Boolean(
			this.state.pub.text || this.state.pub.media?.length,
		);
		const showNext = haveAnyContent;

		this.text = this._makeMenuText();

		return defineMenu([
			[
				{
					id: 'TEXT_MODE',
					label: this.state.mdV1Mode
						? t(c, 'switchToStandardModeBtn')
						: t(c, 'switchToMdv1ModeBtn'),
					payload: Number(!this.state.mdV1Mode),
				},
			],
			[
				this.state.replaceMode !== REPLACE_MODES.textOnly && {
					id: 'replaceOnlyTextBtn',
					label: t(c, 'replaceOnlyTextBtn'),
				},
				this.state.replaceMode !== REPLACE_MODES.mediaOnly && {
					id: 'replaceOnlyMediaBtn',
					label: t(c, 'replaceOnlyMediaBtn'),
				},
				this.state.replaceMode !== REPLACE_MODES.both && {
					id: 'replaceTextAndMediaBtn',
					label: t(c, 'replaceTextAndMediaBtn'),
				},
			],
			[
				this.state.pub[PUB_KEYS.text] && {
					id: 'removeTextBtn',
					label: t(c, 'removeTextBtn'),
				},
				this.state.pub[PUB_KEYS.media]?.length && {
					id: 'removeMediaBtn',
					label: t(c, 'removeMediaBtn'),
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
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				haveAnyContent &&
				this.state[EDIT_ITEM_NAME] && {
					id: 'saveBtn',
					label: t(c, 'saveBtn'),
				},
				showNext && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'TEXT_MODE':
				this.state.mdV1Mode = Boolean(payload);

				return this.reload();
			case 'replaceOnlyTextBtn':
				this.state.replaceMode = REPLACE_MODES.textOnly;

				return this.reload();
			case 'replaceOnlyMediaBtn':
				this.state.replaceMode = REPLACE_MODES.mediaOnly;

				return this.reload();
			case 'replaceTextAndMediaBtn':
				this.state.replaceMode = REPLACE_MODES.both;

				return this.reload();
			case 'removeTextBtn':
				return this.reload({
					[PUB_KEYS.text]: null,
					[PUB_KEYS.entities]: null,
				});
			case 'removeMediaBtn':
				return this.reload({ [PUB_KEYS.media]: null });
			case 'showPreviewBtn':
				await this.printFinalPost(this.me[USER_KEYS.id], this.state.pub);

				return this.reload();
			case 'cancelBtn':
				// delete this.state.replaceMode;
				// delete this.state.mdV1Mode;

				if (this.state[EDIT_ITEM_NAME]) return this.go('scheduled-item');

				return this.go(HOME_PAGE);
			case 'nextBtn':
				// delete this.state.replaceMode;
				// delete this.state.mdV1Mode;

				return this.go('pub-tags');
			case 'saveBtn':
				return saveEditedScheduledPost(this.router);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const fullState = makeStateFromMessage(c, this.state.mdV1Mode);
		let pubState;

		if (!fullState) return this.reply(t(c, 'wrongTypeOfPost'));

		if (this.state.replaceMode === REPLACE_MODES.both) {
			pubState = fullState;
		} else if (this.state.replaceMode === REPLACE_MODES.textOnly) {
			pubState = {
				[PUB_KEYS.text]: fullState[PUB_KEYS.text],
				[PUB_KEYS.entities]: fullState[PUB_KEYS.entities],
			};
		} else if (this.state.replaceMode === REPLACE_MODES.mediaOnly) {
			pubState = {
				[PUB_KEYS.media]: fullState[PUB_KEYS.media],
			};
		}

		delete this.state.replaceMode;

		return this.reload(pubState);
	}

	_makeMenuText() {
		const c = this.router.c;
		let details = makeStatePreview(c, this.state.pub);
		let modeMessage = t(c, 'uploadContentBothDescr');

		if (this.state.replaceMode === REPLACE_MODES.textOnly) {
			modeMessage = t(c, 'uploadContentTextOnlyDescr');
		} else if (this.state.replaceMode === REPLACE_MODES.mediaOnly) {
			modeMessage = t(c, 'uploadContentMediaOnlyDescr');
		}

		if (!details) details = t(c, 'noContentMessage');

		const textModeMessage = this.state.mdV1Mode
			? t(c, 'mdV1TextModeDescr')
			: t(c, 'standardTextModeDescr');

		return `${details}\n\n${t(c, 'uploadContentDescr')}\n\n${modeMessage}\n\n${textModeMessage}`;
	}
}
