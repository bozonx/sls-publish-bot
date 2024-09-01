import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { TEMPLATE_NAMES, STATE_KEYS, DEFAULT_STATE } from '../constants.js';

export class PubPostSetup extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.state.pub = {
			...DEFAULT_STATE,
			...(this.state.pub || {}),
		};

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'pubPostSetupDescr')}`;

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
					id: `previewOffBtn`,
					label: t(c, `previewOffBtn`),
					cb: () => this.reload({ [STATE_KEYS.preview]: false }),
				},
			],
			!this.state.pub?.[STATE_KEYS.preview] && [
				{
					id: `previewOnBtn`,
					label: t(c, `previewOnBtn`),
					cb: () => this.reload({ [STATE_KEYS.preview]: true }),
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
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-confirm'),
				},
			],
		]);
	}
}
