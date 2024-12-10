import Fastify from 'fastify';
import sequelize from '@kne/fastify-sequelize';
import dataFormat from '@kne/fastify-response-data-format';
import fp from 'fastify-plugin';
import qs from 'qs';
import admin from '../server/index.js';
import fastifyEnv from '@fastify/env';


const fastify = Fastify({
    logger: true, querystringParser: str => qs.parse(str)
});

fastify.register(fastifyEnv, {
    dotenv: true, schema: {
        type: 'object', properties: {
            DB_DIALECT: {type: 'string', default: 'sqlite'},
            DB_HOST: {type: 'string', default: 'data.db'},
            DB_USERNAME: {type: 'string'},
            DB_PASSWORD: {type: 'string'},
            DB_DATABASE: {type: 'string'},
            ENV: {type: 'string', default: 'local'},
            PORT: {type: 'number', default: 8050}
        }
    }
});

fastify.register(fp(async (fastify) => {
    fastify.register(sequelize, {
        db: {
            dialect: fastify.config.DB_DIALECT,
            host: fastify.config.DB_HOST,
            database: fastify.config.DB_DATABASE,
            username: fastify.config.DB_USERNAME,
            password: fastify.config.DB_PASSWORD
        }, modelsGlobOptions: {
            syncOptions: {}
        }
    });
}));

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

fastify.then(() => {
    fastify.listen({port: fastify.config.PORT, host: '0.0.0.0'}, (err, address) => {
        if (err) throw err;
        console.log(`Server is now listening on ${address}`);
    });
});
