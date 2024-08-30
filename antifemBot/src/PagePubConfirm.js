import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { makePayloadPreview } from './helpers.js';
import { TEMPLATE_NAMES, DEFAULT_STATE } from './constants.js';

export class PagePubConfirm extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = { ...DEFAULT_STATE, ...payload };
		this.text = `${makePayloadPreview(c, this.payload)}\n\n${t(c, 'pubConfirm')}`;

		this.menu = [];

		let templateNames = Object.keys(TEMPLATE_NAMES);

		if (this.payload.template) {
			templateNames = templateNames.filter((i) => i !== this.payload.template);
		}

		for (const tmplName of templateNames) {
			this.menu.push([
				[
					t(c, `template-${tmplName}`),
					async (c) => {
						await c.pager.go('pub-confirm', {
							...this.payload,
							template: tmplName,
						});
					},
				],
			]);
		}

		if (payload.preview) {
			this.menu.push([
				[
					t(c, 'previewOff'),
					async (c) => {
						await c.pager.go('pub-confirm', {
							...this.payload,
							preview: false,
						});
					},
				],
			]);
		} else {
			this.menu.push([
				[
					t(c, 'previewOn'),
					async (c) => {
						await c.pager.go('pub-confirm', {
							...this.payload,
							preview: true,
						});
					},
				],
			]);
		}

		this.menu = [
			...this.menu,
			[
				[
					'🗓️ ' + t(c, 'pubPlan'),
					(c) => {
						// TODO: сформировать и отправить и написать в чат
					},
				],
			],
			[
				[
					t(c, 'toHome'),
					(c) => {
						c.pager.go('home');
					},
				],
				[
					t(c, 'back'),
					(c) => {
						c.pager.go('pub-hour', this.payload);
					},
				],
			],
		];
	}

	async unmount(c) {
		//
	}

	async message(c) {
		//
	}
}
