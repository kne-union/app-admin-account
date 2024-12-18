import {useState, useRef} from 'react';
import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import {Space, Button, App} from 'antd';
import getColumns from './getColumns';
import {Link} from 'react-router-dom';
import {useBaseUrl} from '@common/context';
import AddUser from '../ActionButton/AddUser';
import EditUser from '../ActionButton/EditUser';
import ResetPassword from '../ActionButton/ResetPassword';
import SetSuperAdmin from '../ActionButton/SetSuperAdmin';
import SetUserStatusNormal from '../ActionButton/SetUserStatusNormal';
import CloseUser from '../ActionButton/CloseUser';

const List = createWithRemoteLoader({
    modules: ['components-core:Layout@TablePage', 'components-core:Filter', 'components-core:FormInfo@useFormModal', 'components-core:Global@usePreset']
})(({remoteModules}) => {
    const [TablePage, Filter, useFormModal, usePreset] = remoteModules;
    const [filter, setFilter] = useState([]);
    const {SearchInput, getFilterValue, fields: filterFields} = Filter;
    const {InputFilterItem, AdvancedSelectFilterItem} = filterFields;
    const {ajax, apis} = usePreset();
    const ref = useRef(null);
    const {message} = App.useApp();
    const formModal = useFormModal();
    const filterValue = getFilterValue(filter);
    const baseUrl = useBaseUrl();
    return <TablePage
        {...Object.assign({}, apis[APP_NAME].admin.getUserList, {params: {filter: filterValue}})}
        pagination={{paramsType: 'params'}}
        name="admin-user-list"
        ref={ref}
        columns={[...getColumns({
            renderTenantList: tenants => {
                return (tenants && tenants.length > 0 && (<Space size={0} split={','}>
                    {tenants.map(tenant => {
                        return (<Link key={tenant.id} to={`${baseUrl}/tenant/detail/${tenant.id}?tab=user`}>
                            {tenant.name}
                        </Link>);
                    })}
                </Space>));
            }
        }), {
            name: 'options', title: '操作', type: 'options', fixed: 'right', valueOf: item => {
                const otherOptions = [];
                if (item.status !== 0) {
                    otherOptions.push({
                        children: '设置为正常',
                        message: "确定要设置账号为正常吗?",
                        isDelete: false,
                        onSuccess: () => ref.current.reload(),
                        item,
                        buttonComponent: SetUserStatusNormal
                    });
                }
                if (item.status !== 12) {
                    otherOptions.push({
                        children: '关闭',
                        message: "确定要关闭该账号吗?",
                        isDelete: true,
                        okText: '确认',
                        onSuccess: () => ref.current.reload(),
                        item,
                        buttonComponent: CloseUser
                    });
                }
                return [{
                    children: '编辑', item, onSuccess: () => ref.current.reload(), buttonComponent: EditUser
                }, {
                    children: '修改密码', onSuccess: () => ref.current.reload(), item, buttonComponent: ResetPassword
                }, {
                    onSuccess: () => ref.current.reload(),
                    item,
                    confirm: true,
                    isDelete: false,
                    buttonComponent: SetSuperAdmin
                }, ...otherOptions];
            }
        }]}
        page={{
            filter: {
                value: filter,
                onChange: setFilter,
                list: [[<InputFilterItem label="邮箱" name="email"/>, <InputFilterItem label="电话" name="phone"/>,
                    <AdvancedSelectFilterItem
                        label="状态"
                        name="status"
                        single
                        api={{
                            loader: () => {
                                return {
                                    pageData: [{label: '正常', value: 0}, {
                                        label: '初始化未激活', value: 1
                                    }, {label: '已关闭', value: 12}]
                                };
                            }
                        }}
                    />, <AdvancedSelectFilterItem
                        label="是否管理员"
                        name="isSuperAdmin"
                        single
                        api={{
                            loader: () => {
                                return {
                                    pageData: [{label: '是', value: true}, {label: '否', value: false}]
                                };
                            }
                        }}
                    />]]
            }, titleExtra: (<Space align="center">
                <SearchInput name="nickname" label="昵称"/>
                <AddUser type="primary" onSuccess={() => {
                    ref.current.reload();
                }}>添加用户</AddUser>
            </Space>)
        }}
    />
});

export default List;
