import {createWithRemoteLoader} from '@kne/remote-loader';
import {APP_NAME} from '@common/systemConstant';
import {App} from "antd";

const SwitchTenantStatus = createWithRemoteLoader({
    modules: ['components-core:Global@usePreset', 'components-core:ConfirmButton']
})(({remoteModules, item, onSuccess, ...props}) => {
    const [usePreset, ConfirmButton] = remoteModules;
    const {ajax, apis} = usePreset();
    const {message} = App.useApp();
    if (item.status === 0) {
        return <ConfirmButton {...props} isDelete={false} danger message="确定要关闭该租户吗?" okText="关闭"
                              onClick={async () => {
                                  const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.closeTenant, {
                                      data: Object.assign({}, {tenantId: item.id})
                                  }));
                                  if (resData.code !== 0) {
                                      return;
                                  }
                                  message.success('关闭租户成功');
                                  onSuccess && onSuccess();
                              }}>关闭</ConfirmButton>
    }
    return <ConfirmButton {...props} isDelete={false} message="确定要开启该租户吗?" okText="开启"
                          onClick={async () => {
                              const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].admin.openTenant, {
                                  data: Object.assign({}, {tenantId: item.id})
                              }));
                              if (resData.code !== 0) {
                                  return;
                              }
                              message.success('开启租户成功');
                              onSuccess && onSuccess();
                          }}>开启</ConfirmButton>
});

export default SwitchTenantStatus;
