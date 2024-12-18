import { createWithRemoteLoader } from '@kne/remote-loader';
import { CompanyInfo as CompanyInfoInner } from '@components/TenantSetting';
import {APP_NAME} from '@common/systemConstant';

const CompanyInfo = createWithRemoteLoader({
  modules: ['components-core:InfoPage', 'component-core:Global@usePreset']
})(({ remoteModules, tenantId }) => {
  const [InfoPage, usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <InfoPage>
      <CompanyInfoInner
        {...apis[APP_NAME].admin.getCompanyInfo}
        params={{ tenantId }}
        tenantId={tenantId}
        apis={{
          saveCompanyInfo: apis[APP_NAME].admin.saveCompanyInfo
        }}
      />
    </InfoPage>
  );
});

export default CompanyInfo;
