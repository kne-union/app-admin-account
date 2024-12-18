import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import {Button, App} from "antd";
import md5 from 'md5';
import ResetPasswordFormInner from "../List/ResetPasswordFormInner";

const ResetPasswordButton = createWithRemoteLoader({
    modules: ['components-core:FormInfo@useFormModal', 'components-core:Global@usePreset']
})(({remoteModules, item, onSuccess, ...props}) => {
    const [useFormModal, usePreset] = remoteModules;
    const formModal = useFormModal();
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    return <Button {...props} onClick={() => {
        formModal({
            title: '修改用户密码', size: 'small', autoClose: true, children: <ResetPasswordFormInner/>, formProps: {
                onSubmit: async data => {
                    const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.resetUserPassword, {
                        data: {
                            password: md5(data.password), userId: item.id
                        }
                    }));
                    if (resData.code !== 0) {
                        return false;
                    }
                    message.success('修改密码成功');
                }
            }
        })
    }}/>
});

export default ResetPasswordButton;
