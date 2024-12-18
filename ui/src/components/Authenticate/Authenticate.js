import {createWithRemoteLoader} from '@kne/remote-loader';
import {Navigate, useLocation} from 'react-router-dom';
import {APP_NAME} from '@common/systemConstant';
import Fetch from '@kne/react-fetch';
import {get} from 'lodash-es';
import {useEffect} from 'react';

const CheckAccountIsInit = createWithRemoteLoader({
    modules: ['component-core:Global@useGlobalContext']
})(({remoteModules, data, baseUrl, children}) => {
    const [useGlobalContext] = remoteModules;
    const {global, setGlobal} = useGlobalContext('themeToken');

    const location = useLocation();
    if (data.userInfo.status === 1) {
        return <Navigate
            to={`${baseUrl || ''}/modify/${encodeURIComponent(data.userInfo.email)}?referer=${encodeURIComponent(location.pathname + location.search)}`}
            replace/>;
    }

    useEffect(() => {
        if (get(data, 'companyInfo.themeColor') && get(data, 'companyInfo.themeColor') !== get(global, 'colorPrimary')) {
            setGlobal(themeToken => Object.assign({}, themeToken, {colorPrimary: get(data, 'companyInfo.themeColor')}));
        }
    }, []);

    return children;
});

export const UserInfo = createWithRemoteLoader({
    modules: ['components-core:Global@SetGlobal', 'components-core:Global@usePreset']
})(({remoteModules, baseUrl, children}) => {
    const [SetGlobal, usePreset] = remoteModules;
    const {apis} = usePreset();
    return (<Fetch
        {...Object.assign({}, apis[APP_NAME].account.getUserInfo)}
        render={({data}) => {
            return (<CheckAccountIsInit baseUrl={baseUrl} data={data}>
                <SetGlobal globalKey="userInfo" value={data} needReady>
                    {children}
                </SetGlobal>
            </CheckAccountIsInit>);
        }}
    />);
});

export const SuperAdminInfo = createWithRemoteLoader({
    modules: ['components-core:Global@SetGlobal', 'components-core:Global@usePreset']
})(({remoteModules, children}) => {
    const [SetGlobal, usePreset] = remoteModules;
    const {apis} = usePreset();
    return (<Fetch
        cache="super-admin-info"
        {...Object.assign({}, apis[APP_NAME].admin.getSuperAdminInfo)}
        render={({data}) => {
            return (<SetGlobal globalKey="userInfo" value={data} needReady>
                {children}
            </SetGlobal>);
        }}
    />);
});

export const TenantUserInfo = createWithRemoteLoader({
    modules: ['components-core:Global@SetGlobal', 'components-core:Global@usePreset']
})(({remoteModules, baseUrl, children}) => {
    const [SetGlobal, usePreset] = remoteModules;
    const {apis} = usePreset();
    return (<Fetch
        {...Object.assign({}, apis[APP_NAME].account.getTenantUserInfo)}
        render={({data, reload}) => {
            return (<CheckAccountIsInit baseUrl={baseUrl} data={Object.assign({}, data, {reload})}>
                <SetGlobal globalKey="userInfo" value={Object.assign({}, data, {reload})} needReady>
                    {children}
                </SetGlobal>
            </CheckAccountIsInit>);
        }}
    />);
});
