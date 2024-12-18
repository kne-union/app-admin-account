import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import FormInner from '../List/FormInner';
import {Button, App} from "antd";

const EditUserButton = createWithRemoteLoader({
    modules: ['components-core:FormInfo@useFormModal', 'components-core:Global@usePreset']
})(({remoteModules, item, onSuccess, ...props}) => {
    const [useFormModal, usePreset] = remoteModules;
    const formModal = useFormModal();
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    return <Button {...props} onClick={() => {
        formModal({
            title: '编辑用户信息', size: 'small', children: <FormInner/>, autoClose: true, formProps: {
                data: Object.assign({}, item), onSubmit: async data => {
                    const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.saveUser, {
                        data: Object.assign({}, data, {id: item.id})
                    }));
                    if (resData.code !== 0) {
                        return false;
                    }
                    message.success('用户信息修改成功');
                    onSuccess && onSuccess();
                }
            }
        });
    }}/>
});

export default EditUserButton;
