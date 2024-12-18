import { createWithRemoteLoader } from '@kne/remote-loader';
import dayjs from 'dayjs';

const BaseInfo = createWithRemoteLoader({
  modules: ['components-core:InfoPage', 'components-core:Descriptions', 'components-core:Enum']
})(({ record, remoteModules }) => {
  const [InfoPage, Descriptions] = remoteModules;
  return (
    <InfoPage>
      <InfoPage.Part title="基本信息">
        <Descriptions
          dataSource={[
            [
              { label: '租户名称', content: record.name },
              {
                label: '账号数量',
                content: record.accountNumber
              }
            ],
            [
              { label: '服务开始时间', content: dayjs(record.serviceStartTime).format('YYYY-MM-DD') },
              {
                label: '服务结束时间',
                content: dayjs(record.serviceEndTime).format('YYYY-MM-DD')
              }
            ],
            [
              {
                label: '简介',
                content: record.description
              }
            ]
          ]}
        />
      </InfoPage.Part>
    </InfoPage>
  );
});

export default BaseInfo;
