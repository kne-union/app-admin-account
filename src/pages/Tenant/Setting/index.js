import { createWithRemoteLoader } from '@kne/remote-loader';

const TenantSetting = createWithRemoteLoader({
  modules: ['components-account:TenantSetting']
})(({ remoteModules, ...props }) => {
  const [TenantSetting] = remoteModules;

  return <TenantSetting {...props} />;
});

export default TenantSetting;
