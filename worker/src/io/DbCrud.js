import { PrismaClient } from '@prisma/client';

export class DbCrud {
	prisma;

	constructor(prismaAdapter) {
		this.prisma = new PrismaClient(prismaAdapter && { adapter: prismaAdapter });
	}

	async getAll(tableName, select, where, orderBy) {
		return this.prisma[tableName].findMany({
			where,
			select,
			orderBy,
		});
	}

	async getItem(tableName, itemId, select, where) {
		return this.prisma[tableName].findUnique({
			where: {
				id: itemId,
				...where,
			},
			select,
		});
	}

	async createItem(tableName, data) {
		return this.prisma[tableName].create({ data });
	}

	async updateItem(tableName, fullData, where) {
		const { id, ...data } = fullData;

		return this.prisma[tableName].update({
			where: {
				id,
				...where,
			},
			data,
		});
	}

	async deleteItem(tableName, itemId, where) {
		return this.prisma[tableName].delete({
			where: {
				id: itemId,
				...where,
			},
		});
	}
}
