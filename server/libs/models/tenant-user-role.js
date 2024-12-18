const tenantUserRole = ({DataTypes, definePrimaryType}) => {
    return {
        model: {
            tenantId: definePrimaryType('tenantId', {
                comment: '租户id', allowNull: false
            })
        }
    };
};

export default tenantUserRole;
