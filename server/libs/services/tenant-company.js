import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";
import {isNil} from 'lodash-es';

const tenantCompanyService = fp(async (fastify, options) => {
    const {models, services} = fastify[appInfo.name];

    const getTenantCompany = async ({tenantId}) => {
        const tenant = await services.tenant.getTenantInstance({uuid: tenantId});
        const companyInfo = await models.companyInfo.findOne({
            where: {
                tenantId: tenant.id
            }
        });

        if (!companyInfo) {
            return await models.companyInfo.create({tenantId: tenant.id});
        }

        return companyInfo;
    };

    const saveTenantCompany = async ({id, tenantId, ...others}) => {
        const tenant = await services.tenant.getTenantInstance({uuid: tenantId});
        const companyInfo = await models.companyInfo.findByPk(id);

        if (tenant.id !== companyInfo.tenantId) {
            throw new Error('租户Id和当前租户用户的租户Id不一致');
        }
        ['name', 'shortName', 'themeColor', 'logo', 'description'].forEach(name => {
            if (!isNil(others[name])) {
                companyInfo[name] = others[name];
            }
        });
        await companyInfo.save();
        return companyInfo;
    };

    services.tenantCompany = {
        getTenantCompany, saveTenantCompany
    };
});

export default tenantCompanyService;
