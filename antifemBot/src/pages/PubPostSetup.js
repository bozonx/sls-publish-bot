import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { TEMPLATE_NAMES, PUB_KEYS, DEFAULT_SETUP_STATE } from '../constants.js';

export class PubPostSetup extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.state.pub = {
			...DEFAULT_SETUP_STATE,
			...(this.state.pub || {}),
		};

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'pubPostSetupDescr')}`;

		const restTemplateNames = Object.keys(TEMPLATE_NAMES).filter(
			(i) => i !== this.state.pub?.[PUB_KEYS.template],
		);
		const previewIsOn = Boolean(this.state.pub[PUB_KEYS.preview]);

		return defineMenu([
			...restTemplateNames.map((tmplName) => [
				{
					id: 'TEMPLATE',
					label: `${t(c, 'useTemplateBtn')}: ` + t(c, `template-${tmplName}`),
					payload: tmplName,
				},
			]),

			[
				{
					id: `preview`,
					label: t(c, previewIsOn ? `previewOffBtn` : `previewOnBtn`),
					payload: !previewIsOn,
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
				{
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
			case 'preview':
				console.log(44444, payload);

				return this.reload({ [PUB_KEYS.preview]: payload });
			case 'backBtn':
				return this.go('pub-hour');
			case 'toHomeBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-confirm');
			default:
				return false;
		}
	}
}
