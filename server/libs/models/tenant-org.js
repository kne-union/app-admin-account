const tenantOrg = ({DataTypes, definePrimaryType}) => {
    return {
        model: {
            name: {
                type: DataTypes.STRING, allowNull: false, comment: '组织名称'
            }, description: {
                type: DataTypes.TEXT, comment: '组织简介'
            }, pid: definePrimaryType('pid', {
                defaultValue: 0, allowNull: false, comment: '父节点id，0:为根节点'
            }), status: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, comment: '组织节点状态,0:正常,11:已冻结，不允许编辑,12:已关闭，不允许编辑不允许使用'
            }
        }, associate: ({tenantOrg, tenant}) => {
            tenantOrg.belongsTo(tenant);
        }
    };
};

export default tenantOrg;
