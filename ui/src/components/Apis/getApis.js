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
            sendSMSCode: {
                url: `${prefix}/account/sendSMSCode`, method: 'POST'
            }, sendEmailCode: {
                url: `${prefix}/account/sendEmailCode`, method: 'POST'
            }, register: {
                url: `${prefix}/account/register`, method: 'POST'
            }, getUserInfo: {
                url: `${prefix}/user/getUserInfo`, method: 'GET', cache: 'get-user-info'
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
