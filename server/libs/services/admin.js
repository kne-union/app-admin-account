import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const adminService = fp(async (fastify, options) => {
    const {models, services, global} = fastify[appInfo.name];

    const checkIsSuperAdmin = async () => {
    };

    services.admin = {checkIsSuperAdmin};
});

export default adminService;
