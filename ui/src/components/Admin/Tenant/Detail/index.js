import {createWithRemoteLoader} from '@kne/remote-loader';
import {useParams, useSearchParams} from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import {APP_NAME} from '@common/systemConstant';
import EditTenant from '../ActionButton/EditTenant';
import BaseInfo from '../BaseInfo';
import CompanyInfo from '../CompanyInfo';

const detailMap = {
    baseInfo: BaseInfo,
    companyInfo: CompanyInfo,
};

const Detail = createWithRemoteLoader({
    modules: ['components-core:Layout@StateBarPage', 'components-core:Layout@PageHeader', 'components-core:Global@usePreset']
})(({remoteModules}) => {
    const [StateBarPage, PageHeader, usePreset] = remoteModules;
    const {apis, ajax} = usePreset();
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeKey = searchParams.get('tab') || 'baseInfo';
    const DetailInner = detailMap[activeKey];
    const renderWithTenantInfo = children => {
        return <Fetch cache="tenant-info" {...Object.assign({}, apis[APP_NAME].admin.getTenantInfo, {params: {id}})}
                      render={({data: tenant, reload}) => children({tenant, reload})}/>;
    };
    return <StateBarPage stateBar={{
        activeKey, onChange: key => {
            searchParams.set('tab', key);
            setSearchParams(searchParams.toString());
        }, stateOption: [{tab: '租户信息', key: 'baseInfo'}, {tab: '公司信息', key: 'companyInfo'}, {
            tab: '租户权限', key: 'permission'
        }, {tab: '角色权限', key: 'role'}, {
            tab: '组织架构', key: 'org'
        } /*, {tab: '共享组', key: 'shareGroup'}*/, {tab: '租户用户', key: 'user'}, {
            tab: '操作日志', key: 'operationLog'
        }]
    }} header={renderWithTenantInfo(({tenant, reload}) => {
        return <PageHeader title={tenant.name} info={`编号:${tenant.id}`} buttonOptions={{
            list: [{
                children: '编辑', type: 'primary', buttonComponent: EditTenant, item: tenant, onSuccess: () => reload()
            }]
        }}/>;
    })}>
        {renderWithTenantInfo(({ tenant }) => (
            <DetailInner record={tenant} tenantId={tenant.id} />
        ))}
    </StateBarPage>
});

export default Detail;
