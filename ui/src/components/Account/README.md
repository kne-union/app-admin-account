
# Account


### 概述

账号注册登录初始化激活找回密码


### 示例(全屏)

#### 示例代码

- Login
- 登录
- _Account(@components/Account),antd(antd)

```jsx
const {LoginOuterContainer, Login} = _Account;
const {Flex, Radio, Space} = antd;
const {useState} = React;
const BaseExample = () => {
    const [type, setType] = useState('email');
    return <Flex vertical gap={8}>
        <Space><span>类型:</span><Radio.Group value={type} onChange={(e) => {
            setType(e.target.value);
        }} options={[{label: '邮箱', value: 'email'}, {label: '手机', value: 'phone'}]}/></Space>
        <LoginOuterContainer>
            <Login type={type}/>
        </LoginOuterContainer>
    </Flex>;
};

render(<BaseExample/>);

```

- Register
- 注册
- _Account(@components/Account),antd(antd)

```jsx
const {LoginOuterContainer, Register} = _Account;
const {Flex, Radio, Space} = antd;
const {useState} = React;
const BaseExample = () => {
    const [type, setType] = useState('email');
    return <Flex vertical gap={8}>
        <Space><span>类型:</span><Radio.Group value={type} onChange={(e) => {
            setType(e.target.value);
        }} options={[{label: '邮箱', value: 'email'}, {label: '手机', value: 'phone'}]}/></Space>
        <LoginOuterContainer>
            <Register type={type}/>
        </LoginOuterContainer>
    </Flex>;
};

render(<BaseExample/>);

```

- Tenant
- 租户选择
- _Account(@components/Account),antd(antd)

```jsx
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

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

