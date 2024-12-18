import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import {App} from "antd";

const SetSuperAdmin = createWithRemoteLoader({
    modules: ['components-core:Global@usePreset', 'components-core:ConfirmButton']
})(({remoteModules, item, onSuccess, ...props}) => {
    const [usePreset, ConfirmButton] = remoteModules;
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();

    if (item.isSuperAdmin) {
        return <ConfirmButton {...props} message="确定要取消账号的超管权限吗？" onClick={async () => {
            const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.setSuperAdmin, {
                data: {status: false, userId: item.id}
            }));
            if (resData.code !== 0) {
                return;
            }
            message.success('设置成功');
            onSuccess && onSuccess();
        }}>取消超管</ConfirmButton>
    }

    return <ConfirmButton {...props} message="确定要设置账号为超管吗？" onClick={async () => {
        const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.setSuperAdmin, {
            data: {status: true, userId: item.id}
        }));
        if (resData.code !== 0) {
            return;
        }
        message.success('设置成功');
        onSuccess && onSuccess();
    }}>设置超管</ConfirmButton>
});

export default SetSuperAdmin
