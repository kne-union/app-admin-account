import LoginOuterContainer from '../LoginOuterContainer';
import {createWithRemoteLoader} from '@kne/remote-loader';
import {useRef, useState} from 'react';
import useNavigate from '@common/useNavigate';
import DoLogin from './DoLogin';
import {useProps} from '@common/context';
import {APP_NAME} from "@common/systemConstant";
import LoginComponent from '../Login';
import LoginTenant from '../Tenant';


const Login = createWithRemoteLoader({
    modules: ['components-core:Global@usePreset']
})(({remoteModules}) => {
    const [usePreset] = remoteModules;
    const {baseUrl, isTenant, apis, loginTitle, registerUrl, forgetUrl, accountType} = useProps();
    const navigate = useNavigate();
    const refererRef = useRef(baseUrl);
    const [tenantList, setTenantList] = useState([]);
    const {ajax, apis: presetApis} = usePreset();
    const account = Object.assign({}, presetApis[APP_NAME]?.account, apis);

    return <LoginOuterContainer>
        <DoLogin>{({login}) => {
            if (isTenant && tenantList && tenantList.length > 0) {
                const setCurrentTenant = async tenantId => {
                    const {data: resData} = await ajax(Object.assign({}, account.setCurrentTenantId, {
                        data: {tenantId}
                    }));
                    if (resData.code !== 0) {
                        return;
                    }
                    navigate(refererRef.current ? refererRef.current : baseUrl);
                };
                if (tenantList.length === 1) {
                    setCurrentTenant(tenantList[0].id);
                }
                return (<LoginTenant
                    data={tenantList}
                    onChange={({tenantId}) => {
                        setCurrentTenant(tenantId);
                    }}
                    onBack={() => {
                        setTenantList([]);
                    }}
                />);
            }

            return (<LoginComponent
                title={loginTitle} registerUrl={registerUrl} forgetUrl={forgetUrl}
                onSubmit={async formData => {
                    await login(Object.assign({}, formData, {isTenant, type: accountType}), ({tenantList, referer}) => {
                        refererRef.current = referer;
                        isTenant && setTenantList(tenantList);
                    });
                }}
            />);
        }}</DoLogin>
    </LoginOuterContainer>
});

export default Login;
