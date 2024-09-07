import { PrismaClient } from '@prisma/client';

export class DbCrud {
	prisma;

	constructor(prismaAdapter) {
		this.prisma = new PrismaClient(
			prismaAdapter && { adapter: this.prismaAdapter },
		);
	}

	async getAll(tableName, select, where) {
		const result = await this.prisma[tableName].findMany({
			where,
			select,
		});

		return result;
	}

	async getItem(tableName, itemId, where) {
		const result = await this.prisma[tableName].findUnique({
			where: {
				id: itemId,
				...where,
			},
		});

		return result;
	}

	async createItem(tableName, data) {
		const result = await this.prisma[tableName].create({ data });

		return result;
	}

	async updateItem(tableName, fullData, where) {
		const { id, ...data } = fullData;
		const result = await this.prisma[tableName].update({
			where: {
				id,
				...where,
			},
			data,
		});

		return result;
	}

	async deleteItem(tableName, itemId, where) {
		const result = await this.prisma[tableName].delete({
			where: {
				id: itemId,
				...where,
			},
		});

		return result;
	}
}
