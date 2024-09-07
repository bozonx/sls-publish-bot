import { PrismaClient } from '@prisma/client';

export class DbCrud {
	prismaAdapter;
	prisma;

	constructor(prismaAdapter) {
		this.prismaAdapter = prismaAdapter;
		this.prisma = new PrismaClient({ adapter: this.prismaAdapter });
	}

	async getAll(tableName, where) {
		const result = await this.prisma[tableName].findMany({
			where,
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

	async createNewRecord(tableName, data) {
		const result = await this.prisma[tableName].create({ data });

		return result;
	}

	async updateRecord(tableName, itemId, data, where) {
		const result = await this.prisma[tableName].update({
			where: {
				id: itemId,
				...where,
			},
			data,
		});

		return result;
	}

	async deleteRecord(tableName, itemId, where) {
		const result = await this.prisma[tableName].delete({
			where: {
				id: itemId,
				...where,
			},
		});

		return result;
	}
}
