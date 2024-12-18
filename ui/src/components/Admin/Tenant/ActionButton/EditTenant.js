import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import FormInner from '../FormInner';
import {Button, App} from "antd";

const EditTenantButton = createWithRemoteLoader({
    modules: ['components-core:FormInfo@useFormModal', 'components-core:Global@usePreset']
})(({remoteModules, item, onSuccess, ...props}) => {
    const [useFormModal, usePreset] = remoteModules;
    const formModal = useFormModal();
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    return <Button {...props} onClick={() => {
        formModal({
            title: '编辑租户信息', size: 'small', children: <FormInner/>, autoClose: true, formProps: {
                data: Object.assign({}, item), onSubmit: async data => {
                    const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.saveTenant, {
                        data: Object.assign({}, data, {id: item.id})
                    }));
                    if (resData.code !== 0) {
                        return false;
                    }
                    message.success('租户信息修改成功');
                    onSuccess && onSuccess();
                }
            }
        });
    }}/>
});

export default EditTenantButton;
