const userAccount = ({DataTypes}) => {
    return {
        model: {
            password: {
                type: DataTypes.STRING, allowNull: false, comment: '加密后的密钥'
            }, salt: {
                type: DataTypes.STRING, allowNull: false, comment: '用来加密的盐'
            }, belongToUserId: {
                type: DataTypes.BIGINT.UNSIGNED, comment: '账号所属的userId，用来追踪用户之前设置的密码记录'
            }
        }
    };
};

export default userAccount;
