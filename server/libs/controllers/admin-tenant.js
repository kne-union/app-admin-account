import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const adminTenantController = fp(async (fastify, options) => {
    const {services, authenticate} = fastify[appInfo.name];
    fastify.get(`${options.prefix}/admin/getTenantList`, {
        onRequest: [authenticate.user, authenticate.admin], schema: {
            tags: ['管理后台-租户'], summary: '获取租户列表', query: {
                type: 'object', properties: {
                    name: {
                        type: 'string', description: '租户名'
                    }, serviceStartTime: {
                        type: 'string', format: 'date-time', description: '服务开始时间'
                    }, serviceEndTime: {
                        type: 'string', format: 'date-time', description: '服务结束时间'
                    }, perPage: {
                        type: 'number', description: '每页条数'
                    }, currentPage: {
                        type: 'number', description: '页数'
                    }
                }
            }, response: {
                200: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object', properties: {
                                    pageData: {
                                        type: 'array', items: {
                                            type: 'object', properties: {
                                                id: {type: 'string', description: '租户id'},
                                                name: {type: 'string', description: '租户名称'},
                                                description: {type: 'string', description: '租户简介'},
                                                serviceStartTime: {type: 'string', description: '服务开始时间'},
                                                serviceEndTime: {type: 'string', description: '服务结束时间'},
                                                accountNumber: {type: 'number', description: '最大租户用户数量'},
                                                status: {
                                                    type: 'number', description: '0:正常,10:过期被关闭,11:已禁用,12:已关闭'
                                                },
                                                createdAt: {type: 'string', description: '创建时间'},
                                                updatedAt: {type: 'string', description: '更新时间'}
                                            }
                                        }
                                    }, totalCount: {type: 'number', description: '总数量'}
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async request => {
        const {name, perPage, currentPage} = Object.assign({
            perPage: 20, currentPage: 1
        }, request.query);
        return await services.tenant.getTenantList({
            filter: {name}, perPage, currentPage
        });
    });

    fastify.post(`${options.prefix}/admin/addTenant`, {
        onRequest: [authenticate.user, authenticate.admin], schema: {
            tags: ['管理后台-租户'], summary: '添加租户', body: {
                type: 'object', required: ['name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'], properties: {
                    name: {type: 'string', description: '租户名称'},
                    description: {type: 'string', description: '租户简介'},
                    serviceStartTime: {type: 'string', description: '服务开始时间'},
                    serviceEndTime: {type: 'string', description: '服务结束时间'},
                    accountNumber: {type: 'number', description: '最大租户用户数量'},
                    status: {type: 'number', description: '0:正常,10:过期被关闭,11:已禁用,12:已关闭'},
                    createdAt: {type: 'string', description: '创建时间'},
                    updatedAt: {type: 'string', description: '更新时间'}
                }
            }, response: {
                200: {
                    content: {
                        'application/json': {
                            schema: {}
                        }
                    }
                }
            }
        }
    }, async request => {
        await services.tenant.addTenant(request.body);
        return {};
    });

    fastify.post(
        `${options.prefix}/admin/saveTenant`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                body: {
                    type: 'object',
                    required: ['id', 'name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'],
                    properties: {
                        id: { type: 'string', description: '租户id' },
                        name: { type: 'string', description: '租户名称' },
                        description: { type: 'string', description: '租户简介' },
                        serviceStartTime: { type: 'string', description: '服务开始时间' },
                        serviceEndTime: { type: 'string', description: '服务结束时间' },
                        accountNumber: { type: 'number', description: '最大租户用户数量' }
                    }
                },
                response: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {}
                            }
                        }
                    }
                }
            }
        },
        async request => {
            await services.tenant.saveTenant(request.body);
            return {};
        }
    );

    fastify.post(
        `${options.prefix}/admin/closeTenant`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                tags: ['管理后台-租户'],
                summary: '关闭租户',
                body: {
                    type: 'object',
                    required: ['tenantId'],
                    properties: {
                        tenantId: { type: 'string', description: '租户id' }
                    }
                },
                response: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {}
                            }
                        }
                    }
                }
            }
        },
        async request => {
            const { tenantId } = request.body;
            await services.tenant.closeTenant({ tenantId });
            return {};
        }
    );

    fastify.post(
        `${options.prefix}/admin/openTenant`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                tags: ['管理后台-租户'],
                summary: '开启租户',
                body: {
                    type: 'object',
                    required: ['tenantId'],
                    properties: {
                        tenantId: { type: 'string', description: '租户id' }
                    }
                },
                response: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {}
                            }
                        }
                    }
                }
            }
        },
        async request => {
            const { tenantId } = request.body;
            await services.tenant.openTenant({ tenantId });
            return {};
        }
    );

    fastify.get(
        `${options.prefix}/admin/getCompanyInfo`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                tags: ['管理后台'],
                summary: '获取租户管理的公司信息',
                required: ['tenantId'],
                query: {
                    type: 'object',
                    properties: {
                        tenantId: { type: 'string' }
                    }
                }
            }
        },
        async request => {
            return await services.tenantCompany.getTenantCompany(request.query);
        }
    );

    fastify.post(
        `${options.prefix}/admin/saveCompanyInfo`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                tags: ['管理后台'],
                summary: '修改租户管理的公司信息',
                required: ['tenantId', 'id'],
                body: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        tenantId: { type: 'string' },
                        name: { type: 'string' },
                        shortName: { type: 'string' },
                        themeColor: { type: 'string' },
                        logo: { type: 'string' },
                        description: { type: 'string' }
                    }
                }
            }
        },
        async request => {
            return await services.tenantCompany.saveTenantCompany(request.body);
        }
    );
});

export default adminTenantController;
