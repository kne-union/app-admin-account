import {createWithRemoteLoader} from '@kne/remote-loader';

const FormInner = createWithRemoteLoader({
    modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({remoteModules}) => {
    const [FormInfo, formModule] = remoteModules;
    const {Input, InputNumber, DatePicker, TextArea} = formModule;
    return (<FormInfo
        column={1}
        list={[<Input name="name" label="名称" rule="REQ LEN-0-100"/>,
            <InputNumber name="accountNumber" label="账号数量" rule="REQ" min={1}/>,
            <DatePicker name="serviceStartTime" label="服务开始时间" rule="REQ"/>,
            <DatePicker name="serviceEndTime" label="服务结束时间" rule="REQ"/>,
            <TextArea name="description" label="简介"/>]}
    />);
});

export default FormInner;
