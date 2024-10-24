import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	defineMenu,
	makeStatePreview,
	calculateTextLengths,
	exscidedPostTextLimit,
} from '../helpers/helpers.js';
import { escapeMdV2 } from '../helpers/converters.js';
import { makeStateFromMessage } from '../helpers/publishHelpres.js';
import { isEmptyObj, breakArray } from '../helpers/lib.js';
import {
	PUB_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	USER_KEYS,
} from '../constants.js';

const REPLACE_MODES = {
	textOnly: 'textOnly',
	mediaOnly: 'mediaOnly',
	both: 'both',
};

export class PubContent extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.menuTextInMd = true;

		if (!this.state.pub) this.state.pub = {};
		// copy state to edit in edit mode
		if (this.state[EDIT_ITEM_NAME] && isEmptyObj(this.state.pub))
			this.state.pub = this.state[EDIT_ITEM_NAME];
		// set initial replace mode = both
		if (!this.state.replaceMode) this.state.replaceMode = REPLACE_MODES.both;

		const pub = this.state.pub;
		const hasMedia = Boolean(pub[PUB_KEYS.media]?.length);
		const haveAnyContent = Boolean(pub[PUB_KEYS.textHtml] || hasMedia);
		const editMode = Boolean(this.state[EDIT_ITEM_NAME]);

		const [contentLength] = calculateTextLengths(c, pub);
		const isContentExceeded = exscidedPostTextLimit(
			contentLength,
			pub[PUB_KEYS.media]?.length,
		);

		this.text = await this._makeMenuText(haveAnyContent);

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
			...breakArray(
				[
					pub[PUB_KEYS.textHtml] && {
						id: 'removeTextBtn',
						label: t(c, 'removeTextBtn'),
					},
					hasMedia && {
						id: 'removeMediaBtn',
						label: t(c, 'removeMediaBtn'),
					},
					this.state.replaceMode !== REPLACE_MODES.textOnly && {
						id: 'REPLACE_MODE',
						label: t(c, 'replaceOnlyTextBtn'),
						payload: REPLACE_MODES.textOnly,
					},
					this.state.replaceMode !== REPLACE_MODES.mediaOnly && {
						id: 'REPLACE_MODE',
						label: t(c, 'replaceOnlyMediaBtn'),
						payload: REPLACE_MODES.mediaOnly,
					},
					this.state.replaceMode !== REPLACE_MODES.both && {
						id: 'REPLACE_MODE',
						label: t(c, 'replaceTextAndMediaBtn'),
						payload: REPLACE_MODES.both,
					},
				],
				2,
			),
			haveAnyContent &&
				!isContentExceeded && [
					{
						id: 'showPostBtn',
						label: t(c, 'showPostBtn'),
					},
				],
			[
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				haveAnyContent &&
					!isContentExceeded &&
					editMode && {
						id: 'saveBtn',
						label: t(c, 'saveBtn'),
					},
				haveAnyContent &&
					!isContentExceeded && {
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
			case 'REPLACE_MODE':
				this.state.replaceMode = payload;

				return this.reload();
			case 'removeTextBtn':
				return this.reload({
					[PUB_KEYS.textHtml]: null,
				});
			case 'removeMediaBtn':
				return this.reload({
					[PUB_KEYS.media]: null,
					[PUB_KEYS.media_group_id]: null,
				});
			case 'showPostBtn':
				await this.printFinalPost(this.me[USER_KEYS.tgChatId], this.state.pub);

				return this.reload();
			case 'cancelBtn':
				delete this.state.replaceMode;
				delete this.state.mdV1Mode;

				if (this.state[EDIT_ITEM_NAME])
					return this.go(this.state.editReturnUrl);

				return this.go(HOME_PAGE);
			case 'nextBtn':
				delete this.state.replaceMode;
				delete this.state.mdV1Mode;

				return this.go('pub-tags');
			case 'saveBtn':
				delete this.state.replaceMode;
				delete this.state.mdV1Mode;

				this.state.saveIt = true;

				return this.go(this.state.editReturnUrl);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		let partlyPubState = makeStateFromMessage(
			c,
			this.state.pub,
			this.state.mdV1Mode,
		);

		if (!partlyPubState) return this.reply(t(c, 'wrongTypeOfPost'));

		if (this.state.replaceMode === REPLACE_MODES.textOnly) {
			// do not overwrite media, only overwrite text
			delete partlyPubState[PUB_KEYS.media];
			delete partlyPubState[PUB_KEYS.media_group_id];
		} else if (this.state.replaceMode === REPLACE_MODES.mediaOnly) {
			// do not overwrite text, only overwrite media
			delete partlyPubState[PUB_KEYS.textHtml];
		} else {
			// both - do not overwrite empty text
			if (!partlyPubState[PUB_KEYS.textHtml]?.trim())
				delete partlyPubState[PUB_KEYS.textHtml];
		}

		// overwrite partly the pub state
		return this.reload(partlyPubState);
	}

	async _makeMenuText(haveAnyContent) {
		const c = this.router.c;
		let details = haveAnyContent
			? await makeStatePreview(c, this.state.pub)
			: t(c, 'noContentMessage');
		let replaceModeMessage = t(
			c,
			'uploadContentDescr-' + this.state.replaceMode,
		);

		const textModeMessage = this.state.mdV1Mode
			? t(c, 'mdV1TextModeDescr') // it is in MD V2
			: escapeMdV2(t(c, 'standardTextModeDescr'));

		return (
			`${escapeMdV2(details)}\n\n` +
			`${escapeMdV2(t(c, 'uploadContentDescr'))}\n\n` +
			`${escapeMdV2(replaceModeMessage)}\n\n` +
			textModeMessage
		);
	}
}
