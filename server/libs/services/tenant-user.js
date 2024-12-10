import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const tenantUserService = fp(async (fastify, options) => {
    const {models, services, global} = fastify[appInfo.name];
    const getTenantUser = async () => {
    };
    const addTenantUser = async () => {
    };
    const saveTenantUser = async () => {
    };

    services.tenantUser = {getTenantUser};
});

export default tenantUserService;
