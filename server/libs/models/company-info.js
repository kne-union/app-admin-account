const companyInfo = ({DataTypes}) => {
    return {
        model: {
            name: {
                type: DataTypes.STRING, comment: '公司名称'
            }, shortName: {
                type: DataTypes.STRING, comment: '公司简称'
            }, themeColor: {
                type: DataTypes.STRING, comment: '主题色'
            }, logo: {
                type: DataTypes.STRING, comment: '公司logo'
            }, description: {
                type: DataTypes.TEXT, comment: '公司简介'
            }
        }
    };
};

export default companyInfo;
