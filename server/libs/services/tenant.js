import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const tenantService = fp(async (fastify, options) => {
    const {models, services, global} = fastify[appInfo.name];

    const getTenantInstance = async ({uuid, isClose = false}) => {
        const tenant = await models.tenant.findOne({
            where: {
                uuid
            }
        });
        if (!tenant) {
            throw new Error('租户不存在');
        }

        if (tenant.status !== 0 && !isClose) {
            throw new Error('租户已关闭');
        }
        return tenant;
    };

    const getTenant = async ({uuid}) => {
        const tenant = await getTenantInstance({uuid});
        return Object.assign({}, tenant.get({plain: true}), {id: tenant.uuid});
    };
    services.tenant = {getTenantInstance, getTenant};
});

export default tenantService;
