import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";

const adminController = fp(async (fastify, options) => {
    const {services, authenticate} = fastify[appInfo.name];
    fastify.post(
        `${options.prefix}/admin/initSuperAdmin`,
        {
            onRequest: [authenticate.user],
            schema: {
                tags: ['管理后台'],
                summary: '初始化用户为管理员',
                description: '用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建'
            }
        },
        async request => {
            await services.admin.initSuperAdmin(request.userInfo);
            return {};
        }
    );

    fastify.get(
        `${options.prefix}/admin/getSuperAdminInfo`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                tags: ['管理后台'],
                summary: '获取管理员信息',
                response: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        userInfo: {
                                            type: 'object',
                                            properties: {
                                                id: {type: 'string', description: '用户id'},
                                                nickname: {type: 'string', description: '用户昵称'},
                                                email: {type: 'string', description: '邮箱'},
                                                phone: {type: 'string', description: '电话'},
                                                gender: {type: 'string', description: '性别'},
                                                birthday: {type: 'string', format: 'date', description: '出生日期'},
                                                description: {type: 'string', description: '个人简介'},
                                                currentTenantId: {type: 'string', description: '当前租户ID'},
                                                status: {type: 'number', description: '状态'}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        async request => {
            return {userInfo: request.userInfo};
        }
    );

    fastify.get(
        `${options.prefix}/admin/getTenantInfo`,
        {
            onRequest: [authenticate.user, authenticate.admin],
            schema: {
                tags: ['管理后台-租户'],
                summary: '获取租户基本信息',
                query: {
                    type: 'object',
                    properties: {
                        id: {type: 'string', description: '租户id'}
                    }
                },
                response: {
                    200: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: {type: 'string', description: '租户id'},
                                        name: {type: 'string', description: '租户名称'},
                                        description: {type: 'string', description: '租户简介'},
                                        serviceStartTime: {type: 'string', description: '服务开始时间'},
                                        serviceEndTime: {type: 'string', description: '服务结束时间'},
                                        accountNumber: {type: 'number', description: '最大租户用户数量'},
                                        status: {
                                            type: 'number',
                                            description: '0:正常,10:过期被关闭,11:已禁用,12:已关闭'
                                        },
                                        createdAt: {type: 'string', description: '创建时间'},
                                        updatedAt: {type: 'string', description: '更新时间'}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        async request => {
            const {id} = request.query;
            return await services.tenant.getTenant({uuid: id});
        }
    );
});

export default adminController;
