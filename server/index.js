import fp from 'fastify-plugin';
import path from 'node:path';
import {merge} from 'lodash-es';
import jwt from '@fastify/jwt';
import namespace from "@kne/fastify-namespace";
import appInfo from './libs/appInfo.js';

const adminAccount = fp(async function (fastify, options) {
    options = merge({
        prefix: `/api/v${appInfo.apiVersion}/account`, dbTableNamePrefix: 't_account_', isTest: false, jwt: {
            secret: 'super-secret', expires: null
        }, defaultPassword: 'Aa000000!', sendMessage: async () => {
        }
    }, options);
    fastify.register(jwt, options.jwt);
    fastify.register(namespace, {
        options, name: appInfo.name, global: {
            applications: {[appInfo.name]: appInfo}
        }, modules: [['models', await fastify.sequelize.addModels(path.resolve(appInfo.appDir, './libs/models'), {
            prefix: options.dbTableNamePrefix
        })], ['services', path.resolve(appInfo.appDir, './libs/services')], ['controllers', path.resolve(appInfo.appDir, './libs/controllers')], ['application', Object.assign({}, appInfo)]]
    });
}, {
    name: appInfo.name, dependencies: appInfo.dependencies
});

export default adminAccount;
