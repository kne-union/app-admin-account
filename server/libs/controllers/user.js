import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const userController = fp(async (fastify, options) => {
    const {services, authenticate} = fastify[appInfo.name];

    fastify.get(`${options.prefix}/user/getUserInfo`, {
        onRequest: [authenticate.user]
    }, async request => {
        return {userInfo: request.userInfo};
    });

    fastify.post(`${options.prefix}/user/setCurrentTenantId`, {
        onRequest: [authenticate.user], schema: {
            body: {
                type: 'object', required: ['tenantId'], properties: {
                    tenantId: {type: 'string'}
                }
            }
        }
    }, async request => {
        const {tenantId} = request.body;
        await services.user.setCurrentTenantUUId({uuid: request.userInfo.id, tenantId});
        return {};
    });
});

export default userController;
