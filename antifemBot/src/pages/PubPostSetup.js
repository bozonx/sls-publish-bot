import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	defineMenu,
	generatePostText,
	publishFinalPost,
} from '../helpers.js';
import { TEMPLATE_NAMES, STATE_KEYS, DEFAULT_STATE } from '../constants.js';

export class PubPostSetup extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.state.pub = {
			...DEFAULT_STATE,
			...(this.state.pub || {}),
		};

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'pubConfirm')}`;

		let templateNames = Object.keys(TEMPLATE_NAMES);

		if (this.state.pub?.[STATE_KEYS.template]) {
			templateNames = templateNames.filter(
				(i) => i !== this.state.pub?.[STATE_KEYS.template],
			);
		}

		this.menu = defineMenu([
			...templateNames.map((tmplName) => [
				{
					id: `template-${tmplName}`,
					label: `${t(c, 'useTemplateBtn')}: ` + t(c, `template-${tmplName}`),
					payload: tmplName,
					cb: (btnId, payload) =>
						this.reload({ [STATE_KEYS.template]: payload }),
				},
			]),

			this.state.pub?.[STATE_KEYS.preview] && [
				{
					id: `previewOff`,
					label: t(c, `previewOff`),
					cb: () => this.reload({ [STATE_KEYS.preview]: false }),
				},
			],
			!this.state.pub?.[STATE_KEYS.preview] && [
				{
					id: `previewOn`,
					label: t(c, `previewOn`),
					cb: () => this.reload({ [STATE_KEYS.preview]: true }),
				},
			],

			[
				{
					id: 'previewBtn',
					label: t(c, 'previewBtn'),
					cb: this._printPreview,
				},
			],

			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-hour'),
				},
				{
					id: 'pubPlan',
					label: '🗓️ ' + t(c, 'pubPlan'),
					cb: this._finalPublication,
				},
			],
		]);
	}

	async message() {
		//
	}

	_printPreview = async () => {
		const c = this.router.c;
		const text = generatePostText(c, this.state.pub);

		await publishFinalPost(
			c,
			c.msg.chat.id,
			text,
			this.state.pub[STATE_KEYS.preview],
		);

		return this.reload();
	};

	_finalPublication = async () => {
		const c = this.router.c;

		return c.reply('final');
	};
}
