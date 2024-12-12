import {Button, Col, Row, Space} from 'antd';
import {createWithRemoteLoader} from '@kne/remote-loader';
import VerificationCodeButton from '@components/VerificationCodeButton';
import classnames from 'classnames';
import commonStyle from '../style.module.scss';
import {LeftOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import style from './style.module.scss';

const Register = createWithRemoteLoader({
    modules: ['components-core:FormInfo']
})(({remoteModules, ...p}) => {
    const {onSubmit, title, type, sendVerificationCode, loginUrl} = Object.assign({}, {
        title: '注册', type: 'email', loginUrl: ''
    }, p);
    const [FormInfo] = remoteModules;
    const {Form, SubmitButton, fields} = FormInfo;
    const {Input, PhoneNumber} = fields;
    const navigate = useNavigate();
    return <Form type="inner" size="large" onSubmit={onSubmit}>
        <Button
            className={commonStyle['back-link']}
            type="link"
            size="large"
            icon={<LeftOutlined/>}
            onClick={() => {
                navigate(loginUrl);
            }}
        >已有账户，去登录</Button>
        <Space className={classnames(commonStyle['form-inner'])} size={38} direction="vertical">
            <div className={commonStyle['title']}>{title}</div>
            <div>
                {type === 'phone' && <PhoneNumber name="phone" label="手机" rule="REQ" codeType="code" realtime
                                                  interceptor="phone-number-string"/>}
                {type === 'email' && <Input name="email" label="邮箱" rule="REQ EMAIL" realtime/>}
                <Row align={'bottom'} justify={'space-between'}>
                    <Col className={style['code-field']}>
                        <Input name="code" label="验证码" rule="REQ LEN-6 VALIDATE_CODE"/>
                    </Col>
                    <Col>
                        <VerificationCodeButton
                            className={style['get-code']}
                            type={'link'}
                            target={{name: type}}
                            onClick={sendVerificationCode}
                        >发送验证码</VerificationCodeButton>
                    </Col>
                </Row>
                <Input.Password name="password" label="密码" rule="REQ LEN-6-50"/>
                <Input.Password name="repeatPwd" label="重复密码" rule="REQ LEN-6-50 REPEAT-password"/>
            </div>
            <SubmitButton block size="large">注册</SubmitButton>
        </Space>
    </Form>
});

export default Register;
