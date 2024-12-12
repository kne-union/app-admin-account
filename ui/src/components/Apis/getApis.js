const getApis = options => {
    const {prefix, headers} = Object.assign({}, {prefix: '/api/v1/account'}, options);
    return {
        app: {
            getAppInfo: {
                url: `${prefix}/getAppInfo`, method: 'GET', cache: 'get-app-info'
            },
        }, account: {
            getUserInfo: {
                url: `${prefix}/getUserInfo`, method: 'GET', cache: 'get-user-info'
            }
        }
    };
};

export default getApis;
