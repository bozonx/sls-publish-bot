import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

const tableName = 'PubScheduled';

export class UsersCrudIndex {
	constructor() {
		//
	}

	async getAllScheduled(c) {
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const result = await prisma[tableName].findMany({
			where: {
				// TODO: pub time not null
			},
		});

		return result;
	}

	async getAllNotScheduled() {
		//
	}

	async getItem(itemId) {
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const result = await prisma[tableName].findUnique({
			where: {
				id: itemId,
			},
		});

		return result;
	}

	async createNewRecord(data) {
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const result = await prisma[tableName].create({ data });

		return result;
	}

	async updateRecord(itemId, data) {
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const result = await prisma[tableName].update({
			where: {
				id: itemId,
			},
			data,
		});

		return result;
	}

	async deleteRecord(itemId) {
		const adapter = new PrismaD1(c.env.DB);
		const prisma = new PrismaClient({ adapter });
		const result = await prisma[tableName].delete({
			where: {
				id: itemId,
			},
		});

		return result;
	}
}
