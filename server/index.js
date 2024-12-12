import fp from 'fastify-plugin';
import path from 'node:path';
import {merge} from 'lodash-es';
import jwt from '@fastify/jwt';
import namespace from "@kne/fastify-namespace";
import httpErrors from 'http-errors';
import appInfo from './libs/appInfo.js';

const {Unauthorized, Forbidden} = httpErrors;

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
        })], ['services', path.resolve(appInfo.appDir, './libs/services')], ['controllers', path.resolve(appInfo.appDir, './libs/controllers')], ['authenticate', {
            user: async (request) => {
                const {services} = fastify[appInfo.name];
                const info = await request.jwtVerify();
                //这里判断失效时间
                if (options.jwt.expires && Date.now() - info.iat * 1000 > options.jwt.expires) {
                    throw Unauthorized('身份认证超时');
                }
                request.authenticatePayload = info.payload;
                request.userInfo = await services.user.getUserInfo(request.authenticatePayload);
                request.appName = request.headers['x-app-name'];
            }, tenant: async (request) => {
                const {services} = fastify[appInfo.name];
            }, admin: async (request) => {
                const {services} = fastify[appInfo.name];
            }, createPermission: permission => async request => {
                const permissions = get(request.tenantInfo, 'tenantUser.permissions');
                if (!permissions) {
                    throw Forbidden('未获取到权限信息');
                }
                if (!(permission && permissions.indexOf(permission) > -1)) {
                    throw Forbidden('用户没有权限执行该操作');
                }
            }
        }], ['application', Object.assign({}, appInfo)]]
    });
}, {
    name: appInfo.name, dependencies: appInfo.dependencies
});

export default adminAccount;
