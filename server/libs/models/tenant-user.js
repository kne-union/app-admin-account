const tenantUser = ({DataTypes}) => {
    return {
        model: {
            uuid: {
                type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, comment: '租户用户uuid'
            }, name: {
                type: DataTypes.STRING, allowNull: false, comment: '姓名'
            }, phone: {
                type: DataTypes.STRING, comment: '手机号'
            }, email: {
                type: DataTypes.STRING, comment: '邮箱'
            }, avatar: {
                type: DataTypes.STRING, comment: '头像fileId'
            }, description: {
                type: DataTypes.TEXT, comment: '描述'
            }, status: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, comment: '0:正常,11:已禁用,12:已关闭'
            }
        }, options: {
            indexes: [{
                unique: true, fields: ['uuid', 'deleted_at']
            }]
        }, associate: ({user, tenant, tenantUser, tenantRole, tenantUserRole, tenantOrg, tenantUserOrg}) => {
            tenantUser.belongsTo(tenant);
            tenantUser.belongsTo(user);
            tenantUser.belongsToMany(tenantRole, {through: tenantUserRole});
            tenantUser.belongsToMany(tenantOrg, {through: tenantUserOrg});
        }
    };
};

export default tenantUser;
