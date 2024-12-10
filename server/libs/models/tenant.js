const tenant = ({DataTypes}) => {
    return {
        model: {
            uuid: {
                type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, comment: '租户uuid'
            }, name: {
                type: DataTypes.STRING, allowNull: false, comment: '租户名'
            }, accountNumber: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, allowNull: false, comment: '租户开通账号数'
            }, serviceStartTime: {
                type: DataTypes.DATE, defaultValue: new Date(), allowNull: false, comment: '租户服务开通时间'
            }, serviceEndTime: {
                type: DataTypes.DATE, allowNull: false, comment: '租户服务到期时间'
            }, status: {
                type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, comment: '0:正常,10:过期被关闭,11:已禁用,12:已关闭'
            }, description: {
                type: DataTypes.TEXT, comment: '租户描述'
            }
        }, options: {
            indexes: [{
                unique: true, fields: ['uuid', 'deleted_at']
            }]
        }, associate: ({tenant, companyInfo}) => {
            tenant.hasOne(companyInfo);
        }
    };
};

export default tenant;
