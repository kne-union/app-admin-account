import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const adminService = fp(async (fastify, options) => {
    const {models, services, global} = fastify[appInfo.name];

    const initSuperAdmin = async user => {
        if ((await models.user.count({
            where: {
                isSuperAdmin: true
            }
        })) > 0) {
            throw new Error('系统已经初始化完成，不能执行该操作');
        }
        const currentUser = await services.user.getUserInstance({uuid: user.id});
        currentUser.isSuperAdmin = true;
        await currentUser.save();
    };

    const checkIsSuperAdmin = async (user) => {
        const currentUser = await services.user.getUserInstance({uuid: user.id});
        return currentUser.isSuperAdmin === true;
    };

    services.admin = {initSuperAdmin, checkIsSuperAdmin};
});

export default adminService;
