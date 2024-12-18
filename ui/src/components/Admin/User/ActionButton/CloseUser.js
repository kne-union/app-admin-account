import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import {App} from "antd";

const CloseUser = createWithRemoteLoader({
    modules: ['components-core:Global@usePreset', 'components-core:ConfirmButton']
})(({remoteModules, item, onSuccess, ...props}) => {
    const [usePreset, ConfirmButton] = remoteModules;
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    return <ConfirmButton {...props} onClick={async () => {
        const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.setUserClose, {
            data: {
                id: item.id
            }
        }));
        if (resData.code !== 0) {
            return;
        }
        message.success('账号已关闭');
        onSuccess && onSuccess();
    }}/>
});

export default CloseUser;
