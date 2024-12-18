import {createWithRemoteLoader} from '@kne/remote-loader';
import {App, Button, Space} from 'antd';
import FormInner from '../FormInner';
import {useRef, useState} from 'react';
import {useBaseUrl} from '@common/context';
import useNavigate from '@common/useNavigate';
import {APP_NAME} from '@common/systemConstant';
import getColumns from './getColumns';
import EditTenant from '../ActionButton/EditTenant';
import SwitchTenantStatus from '../ActionButton/SwitchTenantStatus';

const List = createWithRemoteLoader({
    modules: ['components-core:Layout@TablePage', 'components-core:Filter', 'components-core:FormInfo@useFormModal', 'components-core:Global@usePreset', 'components-core:Modal@useModal']
})(({remoteModules}) => {
    const [TablePage, Filter, useFormModal, usePreset, useModal] = remoteModules;
    const {fields: filterFields, getFilterValue, SearchInput} = Filter;
    const [filter, setFilter] = useState([]);
    const {AdvancedSelectFilterItem} = filterFields;
    const {apis, ajax} = usePreset();
    const formModal = useFormModal();
    const {message} = App.useApp();
    const ref = useRef();
    const baseUrl = useBaseUrl();
    const navigate = useNavigate();
    const modal = useModal();
    const navigateTo = ({id}) => {
        return navigate(`${baseUrl}/tenant/detail/${id}`);
    };
    return <TablePage
        {...Object.assign({}, apis[APP_NAME].admin.getTenantList, {
            params: getFilterValue(filter)
        })} pagination={{paramsType: 'params'}} ref={ref} name="admin-tenant-list"
        columns={[...getColumns({navigateTo}), {
            name: 'options', title: '操作', type: 'options', fixed: 'right', valueOf: item => {
                return [{
                    children: '编辑', item, onSuccess: () => ref.current.reload(), buttonComponent: EditTenant
                }, {
                    item,
                    confirm: true,
                    isDelete: false,
                    onSuccess: () => ref.current.reload(),
                    buttonComponent: SwitchTenantStatus
                }];
            }
        }]} page={{
        filter: {
            value: filter, onChange: setFilter, list: [[<AdvancedSelectFilterItem
                label="状态"
                name="status"
                single
                api={{
                    loader: () => {
                        return {
                            pageData: [{label: '正常', value: 0}, {label: '已关闭', value: 12}]
                        };
                    }
                }}
            />]]
        }, titleExtra: (<Space align="center">
            <SearchInput name="name" label="租户名称"/>
            <Button
                type="primary"
                onClick={() => {
                    const api = formModal({
                        title: '添加租户', size: 'small', children: <FormInner/>, formProps: {
                            onSubmit: async data => {
                                console.log(data);
                                const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.addTenant, {data}));
                                if (resData.code !== 0) {
                                    return;
                                }
                                message.success('添加租户成功');
                                api.close();
                                ref.current.reload();
                            }
                        }
                    });
                }}
            >
                添加租户
            </Button>
        </Space>)
    }}/>
});

export default List;
