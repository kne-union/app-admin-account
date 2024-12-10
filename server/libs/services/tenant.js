import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const tenantService = fp(async (fastify, options) => {
    const {models, services, global} = fastify[appInfo.name];

    services.tenant = {};
});

export default tenantService;
