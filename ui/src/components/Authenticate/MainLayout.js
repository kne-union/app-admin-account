import {createWithRemoteLoader} from '@kne/remote-loader';
import {Outlet} from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import {SuperAdminInfo, UserInfo, TenantUserInfo} from './Authenticate';
import {get} from 'lodash-es';
import {APP_NAME} from '@common/systemConstant';

const Global = createWithRemoteLoader({
    modules: ['components-core:Global']
})(({remoteModules, paths, preset, children, ...props}) => {
    const [Global] = remoteModules;
    const {apis} = preset;
    return <Fetch {...Object.assign({}, apis[APP_NAME].app.getAppInfo)} render={({data}) => {
        return (<Global {...props} preset={Object.assign({}, preset, {
            appInfo: data
        })}>
            {children}
        </Global>);
    }}/>;
});

const GlobalLayoutInner = createWithRemoteLoader({
    modules: ['components-core:Layout', 'components-core:Global@useGlobalContext']
})(({remoteModules, navigation, title, children}) => {
    const [Layout, useGlobalContext] = remoteModules;
    const {global} = useGlobalContext('userInfo');

    return (<Layout
        navigation={{
            defaultTitle: title, ...Object.assign({}, navigation, get(global, 'companyInfo.logo') ? {
                headerLogo: {id: get(global, 'companyInfo.logo'), src: null}
            } : {})
        }}
    >
        {children}
    </Layout>);
});

const GlobalLayout = createWithRemoteLoader({
    modules: ['components-core:Global']
})(({remoteModules, navigation, title, preset, children, ...props}) => {
    const [Global] = remoteModules;
    return (<Global {...props} preset={preset}>
        <GlobalLayoutInner {...{navigation, title, children}} />
    </Global>);
});

export const MainLayout = props => {
    return (<GlobalLayout {...props}>
        <Outlet/>
    </GlobalLayout>);
};

export const AfterUserLoginLayout = ({baseUrl, ...props}) => {
    return (<GlobalLayout {...props}>
        <UserInfo baseUrl={baseUrl || "/account"}>
            <Outlet/>
        </UserInfo>
    </GlobalLayout>);
};

export const AfterAdminUserLoginLayout = props => {
    return (<GlobalLayout {...props}>
        <SuperAdminInfo>
            <Outlet/>
        </SuperAdminInfo>
    </GlobalLayout>);
};

export const BeforeLoginLayout = props => {
    return (<Global {...props}>
        <Outlet/>
    </Global>);
};

export const AfterTenantUserLoginLayout = ({baseUrl, ...props}) => {
    return (<GlobalLayout {...props}>
        <TenantUserInfo baseUrl={baseUrl || "/account"}>
            <Outlet/>
        </TenantUserInfo>
    </GlobalLayout>);
};
