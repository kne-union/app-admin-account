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

    const getTenantList = async ({filter, perPage, currentPage}) => {
        const queryFilter = {};
        if (filter?.name) {
            queryFilter.name = {
                [fastify.sequelize.Sequelize.Op.like]: `%${filter.name}%`
            };
        }

        if (filter?.serviceStartTime) {
            queryFilter.serviceStartTime = {
                [fastify.sequelize.Sequelize.Op.gt]: filter.serviceStartTime
            };
        }

        if (filter?.serviceEndTime) {
            queryFilter.serviceEndTime = {
                [fastify.sequelize.Sequelize.Op.lt]: filter.serviceEndTime
            };
        }

        const {count, rows} = await models.tenant.findAndCountAll({
            where: queryFilter, offset: perPage * (currentPage - 1), limit: perPage
        });

        return {
            pageData: rows.map(item => {
                return Object.assign({}, item.get({pain: true}), {id: item.uuid});
            }), totalCount: count
        };
    };

    const addTenant = async (tenant) => {
        if (await models.tenant.count({where: {name: tenant.name}})) {
            throw new Error('租户名称不能重复');
        }
        const t = await fastify.sequelize.instance.transaction();
        try {
            const currentTenant = await models.tenant.create(tenant);
            /*await models.tenantRole.create(
                {
                    name: '系统默认角色',
                    tenantId: currentTenant.uuid,
                    description: '创建租户时自动生成，可以设置权限，不可更改删除，所有租户用户默认拥有该角色',
                    type: 1
                },
                { transaction: t }
            );
            await models.tenantOrg.create(
                {
                    name: '根组织',
                    tenantId: currentTenant.uuid
                },
                { transaction: t }
            );*/
            await t.commit();
        } catch (e) {
            await t.rollback();
            throw e;
        }
    };

    const closeTenant = async ({tenantId}) => {
        const tenant = await getTenantInstance({uuid: tenantId});
        tenant.status = 12;
        await tenant.save();
    };

    const openTenant = async ({tenantId}) => {
        const tenant = await getTenantInstance({uuid: tenantId, isClose: true});
        tenant.status = 0;
        await tenant.save();
    };

    const saveTenant = async tenant => {
        const currentTenant = await services.tenant.getTenantInstance({uuid: tenant.id});
        if (!currentTenant) {
            throw new Error('租户不存在，请刷新以后重试');
        }
        await currentTenant.update(tenant);
    };

    services.tenant = {getTenantInstance, getTenant, getTenantList, addTenant, closeTenant, openTenant, saveTenant};
});

export default tenantService;
