const user = ({DataTypes}) => {
    return {
        model: {
            uuid: {
                type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, comment: '用户uuid'
            }, nickname: {
                type: DataTypes.STRING, comment: '用户昵称'
            }, email: {
                type: DataTypes.STRING, comment: '用户邮箱'
            }, phone: {
                type: DataTypes.STRING, comment: '用户手机号'
            }, userAccountId: {
                type: DataTypes.BIGINT.UNSIGNED, allowNull: false, comment: '当前账号id'
            }, status: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, comment: '0:正常,10:初始化未激活，需要用户设置密码后使用,11:已禁用,12:已关闭'
            }, currentTenantUuid: {
                type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, comment: '当前租户uuid'
            }, avatar: {
                type: DataTypes.STRING, comment: '头像fileId'
            }, gender: {
                type: DataTypes.STRING, comment: 'F:女,M:男'
            }, birthday: {
                type: DataTypes.DATE, comment: '出生日期'
            }, description: {
                type: DataTypes.TEXT, comment: '个人描述'
            }, isSuperAdmin: {
                type: DataTypes.BOOLEAN, comment: '是否是平台超级管理员'
            }
        }, options: {
            indexes: [{
                unique: true, fields: ['uuid', 'deleted_at']
            }, {
                unique: true, fields: ['email', 'deleted_at']
            }, {
                unique: true, fields: ['phone', 'deleted_at']
            }]
        }, associate: ({user, tenant, tenantUser}) => {
            /*user.hasOne(adminRole, {foreignKey: 'userId', sourceKey: 'uuid', constraints: false});
            user.belongsToMany(tenant, {
                through: {model: tenantUser, unique: false},
                otherKey: 'tenantId',
                foreignKey: 'userId',
                targetKey: 'uuid',
                sourceKey: 'uuid',
                constraints: false
            });*/
        }
    };
};

export default user;
