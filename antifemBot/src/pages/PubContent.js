import { PubPageBase } from '../PubPageBase.js';
import { PUB_KEYS } from '../constants.js';
import {
	t,
	makeContentState,
	defineMenu,
	makeStatePreview,
} from '../helpers.js';
import {
	convertTgEntitiesToTgMdV2,
	publishFinalPost,
	printFinalPost,
} from '../publishHelpres.js';

const REPLACE_MODES = {
	textOnly: 'textOnly',
	mediaOnly: 'mediaOnly',
	both: 'both',
};

export class PubContent extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.state.replaceMode = REPLACE_MODES.both;
		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'uploadContentDescr')}`;
		this.menu = defineMenu([
			[
				this.state.replaceMode != REPLACE_MODES.textOnly && {
					id: 'replaceOnlyTextBtn',
					label: t(c, 'replaceOnlyTextBtn'),
					cb: () => {
						this.state.replaceMode = REPLACE_MODES.textOnly;

						return this.reload();
					},
				},
				this.state.replaceMode != REPLACE_MODES.mediaOnly && {
					id: 'replaceOnlyMediaBtn',
					label: t(c, 'replaceOnlyMediaBtn'),
					cb: () => {
						this.state.replaceMode = REPLACE_MODES.mediaOnly;

						return this.reload();
					},
				},
				this.state.replaceMode != REPLACE_MODES.both && {
					id: 'replaceTextAndMediaBtn',
					label: t(c, 'replaceTextAndMediaBtn'),
					cb: () => {
						this.state.replaceMode = REPLACE_MODES.both;

						return this.reload();
					},
				},
			],
			[
				this.state.pub?.[PUB_KEYS.text] && {
					id: 'removeTextBtn',
					label: t(c, 'removeTextBtn'),
					cb: () =>
						this.reload({ [PUB_KEYS.text]: null, [PUB_KEYS.entities]: null }),
				},
				this.state.pub?.[PUB_KEYS.media]?.length && {
					id: 'removeMediaBtn',
					label: t(c, 'removeMediaBtn'),
					cb: () => {
						return this.reload({ [PUB_KEYS.media]: null });
					},
				},
			],
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => {
						delete this.state.replaceMode;

						return this.go('home');
					},
				},
				this._showNext && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => {
						delete this.state.replaceMode;

						return this.go('pub-author');
					},
				},
			],
		]);

		await this._printPreview();
	}

	async onMessage() {
		const c = this.router.c;
		const fullState = makeContentState(c);
		let pubState;

		if (!fullState) return c.reply('ERROR: Wrong type of post');

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

	async _printPreview() {
		const c = this.router.c;
		// const text = convertTgEntitiesToTgMdV2(
		// 	this.state.pub.text,
		// 	this.state.pub.entities,
		// );
		//
		// console.log(1111, text);
		//
		// await publishFinalPost(
		// 	c,
		// 	c.msg.chat.id,
		// 	text,
		// 	Boolean(c.msg.link_preview_options?.url),
		// );

		await printFinalPost(c, c.msg.chat.id, this.state.pub);
	}

	_showNext() {
		// TODO: не показывать эту кнопку если текст слишком большой или слишком много медиа
		return hasPubHaveMedia(this.state.pub) || Boolean(this.state.pub?.text);
	}
}
