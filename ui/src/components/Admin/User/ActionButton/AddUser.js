import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import FormInner from '../List/FormInner';
import {Button, App} from "antd";

const AddUserButton = createWithRemoteLoader({
    modules: ['components-core:FormInfo@useFormModal', 'components-core:Global@usePreset']
})(({remoteModules, onSuccess, ...props}) => {
    const [useFormModal, usePreset] = remoteModules;
    const formModal = useFormModal();
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    return <Button {...props} onClick={() => {
        formModal({
            title: '添加用户', size: 'small', children: <FormInner/>, autoClose: true, formProps: {
                onSubmit: async data => {
                    const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.addUser, {
                        data: Object.assign({}, data)
                    }));
                    if (resData.code !== 0) {
                        return false;
                    }
                    message.success('添加成功');
                    onSuccess && onSuccess();
                }
            }
        });
    }}/>
});

export default AddUserButton;
