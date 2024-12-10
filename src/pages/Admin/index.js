import { createWithRemoteLoader } from '@kne/remote-loader';

const Admin = createWithRemoteLoader({
  modules: ['components-account:Admin']
})(({ remoteModules, ...props }) => {
  const [Admin] = remoteModules;
  return <Admin {...props} />;
});

export default Admin;

export const InitAdmin = createWithRemoteLoader({
  modules: ['components-account:Admin@InitAdmin']
})(({ remoteModules, ...props }) => {
  const [InitAdmin] = remoteModules;
  return <InitAdmin {...props} />;
});
