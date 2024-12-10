import Fastify from 'fastify';
import path from 'node:path';
import sequelize from '@kne/fastify-sequelize';
import dataFormat from '@kne/fastify-response-data-format';
import fp from 'fastify-plugin';
import qs from 'qs';
import admin from '../server/index.js';


const fastify = Fastify({
    logger: true, querystringParser: str => qs.parse(str)
});

fastify.register(sequelize, {
    db: {
        dialect: 'mysql',
        host: 'localhost',
        port: 13306,
        database: 'account',
        username: 'root',
        password: 'password'
    }, modelsGlobOptions: {
        syncOptions: {}
    }, prefix: 't_account_'
});

/*fastify.register(require('@kne/fastify-file-manager'), {
    root: path.resolve('./devServer/static')
});*/

fastify.register(admin, {
    isTest: true, sendMessage: async ({name, type, messageType, props}) => {
        console.log('send message:', name, type, messageType, props);
    }, jwt: {expires: 1000 * 60 * 60 * 24}
});

fastify.register(fp(async (fastify) => {
    await fastify.sequelize.sync();
}));

fastify.register(dataFormat);

fastify.listen({port: 3000}, (err, address) => {
    if (err) throw err;
    // Server is now listening on ${address}
});
