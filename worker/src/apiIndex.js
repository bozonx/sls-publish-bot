import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiInbox from './apiInbox.js';

const app = new Hono().basePath('/api');

// TODO: настроить - dev для всех, prod только указанный домен
app.use('*', cors());

app.route('/bot', apiTgBot);
app.route('/users', apiUser);
app.route('/workspaces', apiWorkspace);
app.route('/blogs', apiBlog);
app.route('/inbox', apiInbox);

export default app;
