import {createWithRemoteLoader} from '@kne/remote-loader';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {merge} from 'lodash-es';
import {App} from 'antd';
import md5 from 'md5';
import {useProps} from '@common/context';
import {setCookies} from '@common/cookies';
import {APP_NAME} from '@common/systemConstant';

const DoLogin = createWithRemoteLoader({
    modules: ['component-core:Global@usePreset']
})(({remoteModules, children}) => {
    const [usePreset] = remoteModules;
    const {apis: presetApis, ajax} = usePreset();
    const {apis, targetUrl, storeKeys, domain} = useProps();
    const account = Object.assign({}, presetApis?.[APP_NAME]?.account, apis);
    const {message} = App.useApp();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const referer = searchParams.get('referer');
    return children({
        login: async ({isTenant, ...formData}, callback) => {
            const {data: resData} = await ajax(merge({}, account.login, {
                data: {
                    ...formData, password: md5(formData.password)
                }
            }));
            if (resData.code !== 0) {
                return;
            }
            let refererHref = targetUrl || '/';

            Object.keys(storeKeys).forEach(key => {
                resData.data[key] && setCookies(storeKeys[key], resData.data[key], domain);
            });

            if (referer) {
                const _referer = decodeURIComponent(referer);
                let obj = new URL(/http(s)?:/.test(_referer) ? _referer : window.location.origin + _referer);
                obj.searchParams.delete('referer');
                Object.values(resData.data).forEach(key => key && obj.searchParams.delete(key.toUpperCase()));
                refererHref = obj.pathname + obj.search;
            }

            if (!isTenant) {
                navigate(refererHref);
                return;
            }

            const {data: resTenantData} = await ajax(Object.assign({}, account.getUserTenant));
            if (resTenantData.code !== 0) {
                return;
            }
            const {tenantList} = resTenantData.data;

            if (!(tenantList && tenantList.length > 0)) {
                message.error('没有可用权限租户');
            }

            if (resData.data.currentTenantId && tenantList && tenantList.some(({id}) => id === resData.data.currentTenantId)) {
                navigate(refererHref);
                return;
            }

            callback && (await Promise.resolve(callback({
                referer: refererHref, tenantList
            })));
            message.success('登录成功');
        }
    });
});

export default DoLogin;
