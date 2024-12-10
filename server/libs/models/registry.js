const registry = ({DataTypes}) => {
    return {
        model: {
            appName: {
                type: DataTypes.STRING, comment: '应用名称'
            }, name: {
                type: DataTypes.STRING, comment: '名'
            }, value: {
                type: DataTypes.JSON, comment: '值'
            }, allowTenantUserEdit: {
                type: DataTypes.BOOLEAN, defaultValue: false, comment: '是否允许租户用户修改'
            }
        }, options: {
            indexes: [{
                unique: true, fields: ['app_name', 'name', 'deleted_at']
            }]
        }, associate: ({tenant, registry}) => {
            registry.belongsTo(tenant);
        }
    };
};

export default registry;
