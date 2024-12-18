const getColumns = ({ navigateTo }) => {
  return [
    {
      name: 'name',
      title: '租户名',
      type: 'mainInfo',
      onClick: ({ colItem: item }) => {
        navigateTo(item);
      }
    },
    {
      name: 'accountNumber',
      title: '账号数量',
      type: 'serialNumberShort'
    },
    {
      name: 'serviceStartTime',
      title: '服务开始时间',
      type: 'date'
    },
    {
      name: 'serviceEndTime',
      title: '服务结束时间',
      type: 'date'
    },
    {
      name: 'description',
      title: '简介',
      type: 'description'
    },
    {
      name: 'status',
      title: '状态',
      type: 'tag',
      valueOf: (item, { name }) => {
        if (item[name] === 0) {
          return { type: 'success', text: '正常' };
        }
        if (item[name] === 11) {
          return { type: 'danger', text: '已禁用' };
        }
        if (item[name] === 12) {
          return { type: 'danger', text: '已关闭' };
        }

        return { text: '其他' };
      }
    }
  ];
};

export default getColumns;
