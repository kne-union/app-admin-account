import {APP_NAME} from '@common/systemConstant';
import {transform} from 'lodash-es';

const getApis = options => {
    const {prefix, headers} = Object.assign({}, {prefix: `/api/${APP_NAME}/v1`}, options);
    return transform({
        app: {
            getAppInfo: {
                url: `${prefix}/app/getAppInfo`, method: 'GET', cache: 'get-app-info'
            },
        }, account: {
            getUserInfo: {
                url: `${prefix}/user/getUserInfo`, method: 'GET', cache: 'get-user-info'
            }, sendSMSCode: {
                url: `${prefix}/account/sendSMSCode`, method: 'POST'
            }, sendEmailCode: {
                url: `${prefix}/account/sendEmailCode`, method: 'POST'
            }, register: {
                url: `${prefix}/account/register`, method: 'POST'
            }, login: {
                url: `${prefix}/account/login`, method: 'POST'
            },
        }, admin: {
            getSuperAdminInfo: {
                url: `${prefix}/admin/getSuperAdminInfo`, method: 'GET'
            }, initSuperAdmin: {
                url: `${prefix}/admin/initSuperAdmin`, method: 'POST'
            }, getTenantList: {
                url: `${prefix}/admin/getTenantList`, method: 'GET'
            }, addTenant: {
                url: `${prefix}/admin/addTenant`, method: 'POST'
            }, closeTenant: {
                url: `${prefix}/admin/closeTenant`, method: 'POST'
            }, openTenant: {
                url: `${prefix}/admin/openTenant`, method: 'POST'
            }, saveTenant: {
                url: `${prefix}/admin/saveTenant`, method: 'POST'
            }, getUserList: {
                url: `${prefix}/admin/getUserList`, method: 'GET'
            }, saveUser: {
                url: `${prefix}/admin/saveUser`, method: 'POST'
            }, addUser: {
                url: `${prefix}/admin/addUser`, method: 'POST'
            }, resetUserPassword: {
                url: `${prefix}/admin/resetUserPassword`, method: 'POST'
            }, setSuperAdmin: {
                url: `${prefix}/admin/setSuperAdmin`, method: 'POST'
            }, setUserClose: {
                url: `${prefix}/admin/setUserClose`, method: 'POST'
            }, setUserNormal: {
                url: `${prefix}/admin/setUserNormal`, method: 'POST'
            }, getTenantInfo: {
                url: `${prefix}/admin/getTenantInfo`, method: 'GET'
            }, getCompanyInfo: {
                url: `${prefix}/admin/getCompanyInfo`, method: 'GET'
            }, saveCompanyInfo: {
                url: `${prefix}/admin/saveCompanyInfo`, method: 'POST'
            }
        }
    }, (result, value, key) => {
        result[key] = transform(value, (result, value, key) => {
            result[key] = Object.assign({}, value, {
                headers: {'X-APP-NAME': APP_NAME}
            });
        }, {});
    }, {});
};

export default getApis;
