import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { TEMPLATE_NAMES, PUB_KEYS, DEFAULT_SETUP_STATE } from '../constants.js';

export class PubPostSetup extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.state.pub = {
			...DEFAULT_SETUP_STATE,
			...(this.state.pub || {}),
		};

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'pubPostSetupDescr')}`;

		const restTemplateNames = Object.keys(TEMPLATE_NAMES).filter(
			(i) => i !== this.state.pub?.[PUB_KEYS.template],
		);

		this.menu = defineMenu([
			...restTemplateNames.map((tmplName) => [
				{
					id: `template-${tmplName}`,
					label: `${t(c, 'useTemplateBtn')}: ` + t(c, `template-${tmplName}`),
					payload: tmplName,
					cb: (payload) => this.reload({ [PUB_KEYS.template]: payload }),
				},
			]),

			this.state.pub?.[PUB_KEYS.preview] && [
				{
					id: `previewOffBtn`,
					label: t(c, `previewOffBtn`),
					cb: () => this.reload({ [PUB_KEYS.preview]: false }),
				},
			],
			!this.state.pub?.[PUB_KEYS.preview] && [
				{
					id: `previewOnBtn`,
					label: t(c, `previewOnBtn`),
					cb: () => this.reload({ [PUB_KEYS.preview]: true }),
				},
			],

			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-hour'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
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
