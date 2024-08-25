import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { keysToCammelCase, normalizeNumbers } from './helpers.js';

const NOT_FOUD_RESULT = { message: 'Not found' };

export async function crudList(c, tableName) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	const session = c.get('session');

	if (session.get('counter')) {
		session.set('counter', session.get('counter') + 1);
	} else {
		session.set('counter', 1);
	}

	console.log(11111, session.get('counter'));

	// let userId = session.get('userId');
	//
	// console.log(222, userId);
	//
	// if (!userId) {
	// 	userId = 1;
	//
	// 	session.set('userId', userId);
	// }

	try {
		result = await prisma[tableName].findMany({
			where: {
				...keysToCammelCase(normalizeNumbers(c.req.query())),
				// TODO: get from session
				createdByUserId: 1,
			},
		});
	} catch (e) {
		c.status(500);

		return c.json({ error: String(e) });
	}

	return c.json(result);
}

export async function crudGet(c, tableName) {
	return c.json(
		await getBase(c, tableName, {
			id: Number(c.req.param().id),
			// TODO: get from session
			createdByUserId: 1,
		}),
	);
}

export async function crudCreate(c, tableName) {
	const { id, createdByUserId, ...data } = await c.req.json();

	return c.json(
		await createBase(c, tableName, {
			...data,
			// TODO: get from session
			createdByUserId: 1,
		}),
	);
}

export async function crudUpdate(c, tableName) {
	const { createdByUserId, ...data } = await c.req.json();

	return c.json(
		await updateBase(c, tableName, data, {
			id: Number(data.id),
			// TODO: get from session
			createdByUserId: 1,
		}),
	);
}

export async function crudDelete(c, tableName) {
	const { id } = c.req.param();
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].delete({
			where: {
				id: Number(id),
				// TODO: get from session
				createdByUserId: 1,
			},
		});
	} catch (e) {
		if (e.code === 'P2025') {
			// not found
			c.status(404);

			return c.json(NOT_FOUD_RESULT);
		}

		c.status(500);

		return c.json({ error: String(e) });
	}

	return c.json(result);
}

export async function getBase(c, tableName, where) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].findUnique({ where });
	} catch (e) {
		c.status(500);

		return { error: String(e) };
	}

	if (!result) {
		c.status(404);

		return NOT_FOUD_RESULT;
	}

	return result;
}

export async function createBase(c, tableName, data) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].create({ data });
	} catch (e) {
		c.status(500);

		return { error: String(e) };
	}

	c.status(201);

	return result;
}

export async function updateBase(c, tableName, data, where) {
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });
	let result;

	try {
		result = await prisma[tableName].update({
			where,
			data,
		});
	} catch (e) {
		if (e.code === 'P2025') {
			// not found
			c.status(404);

			return NOT_FOUD_RESULT;
		}

		c.status(500);

		return { error: String(e) };
	}

	return result;
}
