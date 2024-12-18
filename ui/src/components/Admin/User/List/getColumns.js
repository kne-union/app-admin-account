const getColumns = options => {
    const {renderTenantList} = options;
    return [{
        name: 'avatar',
        title: '头像',
        type: 'avatar',
        valueOf: (item, {name}) => Object.assign({}, {gender: item['gender'] || 'M'}, {id: item[name]})
    }, {
        name: 'nickname', title: '昵称', type: 'mainInfo'
    }, {
        name: 'email', title: '邮箱', type: 'other'
    }, {
        name: 'phone', title: '电话', type: 'serialNumber'
    }, {
        name: 'tenant', title: '所在租户', type: 'description', ellipsis: true, valueOf: item => {
            return renderTenantList(item.tenants);
        }
    }, {
        name: 'isSuperAdmin', title: '是否超级管理员', type: 'other', valueOf: item => {
            return item.isSuperAdmin ? '是' : '否';
        }
    }, {
        name: 'status', title: '状态', type: 'tag', valueOf: (item, {name}) => {
            if (item[name] === 0) {
                return {type: 'success', text: '正常'};
            }
            if (item[name] === 10) {
                return {text: '初始化未激活'};
            }
            if (item[name] === 11) {
                return {type: 'danger', text: '已禁用'};
            }
            if (item[name] === 12) {
                return {type: 'danger', text: '已关闭'};
            }

            return {text: '其他'};
        }
    }, {
        name: 'description', title: '个人简介', type: 'description'
    }];
};

export default getColumns;
