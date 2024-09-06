// got from https://github.com/tgsnake/parser/blob/main/src/Entities.ts

export class Entities {
	offset = 0;
	length = 0;
	type;
	language;
	url;
	userId;
	emojiId;
	collapsed;
	constructor(entities) {
		for (let [key, value] of Object.entries(entities)) {
			this[key] = value;
		}
	}
	[Symbol.for('nodejs.util.inspect.custom')]() {
		const toPrint = {
			_: this.constructor.name,
		};
		for (const key in this) {
			if (this.hasOwnProperty(key)) {
				const value = this[key];
				if (!key.startsWith('_') && value !== undefined && value !== null) {
					toPrint[key] = value;
				}
			}
		}
		return toPrint;
	}
	[Symbol.for('Deno.customInspect')]() {
		return String(
			inspect(this[Symbol.for('nodejs.util.inspect.custom')](), {
				colors: true,
			}),
		);
	}
	toJSON() {
		const toPrint = {
			_: this.constructor.name,
		};
		for (const key in this) {
			if (this.hasOwnProperty(key)) {
				const value = this[key];
				if (!key.startsWith('_') && value !== undefined && value !== null) {
					toPrint[key] = typeof value === 'bigint' ? String(value) : value;
				}
			}
		}
		return toPrint;
	}
	toString() {
		return `[constructor of ${this.constructor.name}] ${JSON.stringify(this, null, 2)}`;
	}
}
