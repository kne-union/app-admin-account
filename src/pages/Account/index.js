import { createWithRemoteLoader } from '@kne/remote-loader';

const Account = createWithRemoteLoader({
  modules: ['components-account:Account']
})(({ remoteModules, ...props }) => {
  const [Account] = remoteModules;

  return <Account {...props} />;
});

export default Account;
