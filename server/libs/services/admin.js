import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const adminService = fp(async (fastify, options) => {
    const {models, services, global} = fastify[appInfo.name];

    services.admin = {};
});

export default adminService;
