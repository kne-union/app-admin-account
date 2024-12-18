const tenantRole = ({DataTypes}) => {
    return {
        model: {
            name: {
                type: DataTypes.STRING, allowNull: false, comment: '角色名称'
            }, description: {
                type: DataTypes.TEXT, comment: '角色简介'
            }, status: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, comment: '组织节点状态,0:正常,11:已冻结，不允许编辑,12:已关闭，不允许编辑不允许使用'
            }, type: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, comment: '0:用户自定义,1:系统默认'
            }
        }, associate: ({tenantRole, tenant}) => {
            tenantRole.belongsTo(tenant);
        }
    };
};

export default tenantRole;
