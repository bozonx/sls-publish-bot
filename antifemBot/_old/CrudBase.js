import { PrismaClient } from '@prisma/client';

const tableName = 'PubScheduled';

export class PublicationSchedulerCrudIndex {
	prismaAdapter;
	prisma;

	constructor(prismaAdapter) {
		this.prismaAdapter = prismaAdapter;
		this.prisma = new PrismaClient({ adapter: this.prismaAdapter });
	}

	async getAll(whereOverwrite) {
		const result = await this.prisma[this.tableName].findMany({
			where: {
				// TODO: pub time not null
				// createdByUserId: userId,
				...whereOverwrite,
			},
		});

		return result;
	}

	async getItem(itemId) {
		const result = await this.prisma[this.tableName].findUnique({
			where: {
				id: itemId,
				// createdByUserId: userId,
			},
		});

		return result;
	}

	async createNewRecord(data) {
		const result = await this.prisma[this.tableName].create({ data });

		return result;
	}

	async updateRecord(itemId, data) {
		const result = await this.prisma[this.tableName].update({
			where: {
				id: itemId,
				// createdByUserId: userId,
			},
			data,
		});

		return result;
	}

	async deleteRecord(itemId) {
		const result = await this.prisma[this.tableName].delete({
			where: {
				id: itemId,
				// createdByUserId: userId,
			},
		});

		return result;
	}
}
