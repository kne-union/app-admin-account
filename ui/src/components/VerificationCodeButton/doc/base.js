const {default: VerificationCodeButton} = _VerificationCodeButton;
const {createWithRemoteLoader} = remoteLoader;
const {Flex} = antd;
const BaseExample = createWithRemoteLoader({
    modules: ['components-core:FormInfo']
})(({remoteModules}) => {
    const [FormInfo] = remoteModules;
    const {Form, fields} = FormInfo;
    const {Input} = fields;
    return <Form>
        <Flex gap={8} align="center">
            <Input name="phone" label="手机号" rule="REQ TEL" realtime/>
            <div style={{paddingTop: "10px"}}>
                <VerificationCodeButton target="phone" type="primary">获取验证码</VerificationCodeButton>
            </div>
        </Flex>
    </Form>
});

render(<BaseExample/>);
