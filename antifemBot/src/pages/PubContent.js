import { PubPageBase } from '../PubPageBase.js';
import { PUB_KEYS, USER_KEYS } from '../constants.js';
import { t, defineMenu, makeStatePreview } from '../helpers.js';
import { makeStateFromMessage, printFinalPost } from '../publishHelpres.js';

const REPLACE_MODES = {
	textOnly: 'textOnly',
	mediaOnly: 'mediaOnly',
	both: 'both',
};

export class PubContent extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.state.replaceMode = REPLACE_MODES.both;
		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'uploadContentDescr')}`;

		await printFinalPost(c, this.me[USER_KEYS.id], this.state.pub);

		return defineMenu([
			[
				this.state.replaceMode != REPLACE_MODES.textOnly && {
					id: 'replaceOnlyTextBtn',
					label: t(c, 'replaceOnlyTextBtn'),
				},
				this.state.replaceMode != REPLACE_MODES.mediaOnly && {
					id: 'replaceOnlyMediaBtn',
					label: t(c, 'replaceOnlyMediaBtn'),
				},
				this.state.replaceMode != REPLACE_MODES.both && {
					id: 'replaceTextAndMediaBtn',
					label: t(c, 'replaceTextAndMediaBtn'),
				},
			],
			[
				this.state.pub?.[PUB_KEYS.text] && {
					id: 'removeTextBtn',
					label: t(c, 'removeTextBtn'),
				},
				this.state.pub?.[PUB_KEYS.media]?.length && {
					id: 'removeMediaBtn',
					label: t(c, 'removeMediaBtn'),
				},
			],
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
				this._showNext && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
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
			case 'toHomeBtn':
				delete this.state.replaceMode;

				return this.go('home');
			case 'nextBtn':
				delete this.state.replaceMode;

				return this.go('pub-author');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const fullState = makeStateFromMessage(c);
		let pubState;

		if (!fullState) return c.reply(t(c, 'wrongTypeOfPost'));

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

		// return this.go('pub-author', pubState);
	}

	_showNext() {
		// TODO: не показывать эту кнопку если текст слишком большой или слишком много медиа
		return hasPubHaveMedia(this.state.pub) || Boolean(this.state.pub?.text);
	}
}
