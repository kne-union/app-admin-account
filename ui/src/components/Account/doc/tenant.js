const {LoginOuterContainer, Tenant} = _Account;
const {Flex} = antd;
const BaseExample = () => {
    return <Flex vertical gap={8}>
        <LoginOuterContainer>
            <Tenant
                data={Array.from({length: 20}).map((value, key) => ({id: key, name: `测试公司${key + 1}`}))}
                onBack={() => {
                    console.log('返回');
                }}
                onChange={({id}) => {
                    console.log(id);
                }}
            />
        </LoginOuterContainer>
        <LoginOuterContainer>
            <Tenant
                data={[]}
                onBack={() => {
                    console.log('返回');
                }}
                onChange={({id}) => {
                    console.log(id);
                }}
            />
        </LoginOuterContainer>
    </Flex>;
};

render(<BaseExample/>);
