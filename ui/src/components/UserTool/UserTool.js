import {createWithRemoteLoader} from '@kne/remote-loader';
import {Button, Col, Divider, List, Popover, Row, Space, App} from 'antd';
import Fetch from '@kne/react-fetch';
import classnames from 'classnames';
import {APP_NAME} from '@common/systemConstant';
import {forwardRef, useImperativeHandle, useState} from 'react';
import {removeCookies} from '@common/cookies';
import style from './style.module.scss';

const TenantList = createWithRemoteLoader({
    modules: ['components-core:Icon']
})(forwardRef(({defaultTenantId, remoteModules, tenantList}, ref) => {
    const [Icon] = remoteModules;
    const [tenantId, setTenantId] = useState(defaultTenantId);
    useImperativeHandle(ref, () => tenantId, [tenantId]);
    return (<List
        dataSource={tenantList}
        renderItem={item => {
            return (<List.Item
                key={item.id}
                onClick={() => {
                    setTenantId(item.id);
                }}
                className={classnames(style['tenant-item'], {
                    [style['current-tenant']]: item.id === tenantId
                })}
            >
                <div>{item.name}</div>
                <Space className={style['current-sign']}>
                    <Icon type="iconfont icon-gouxuan"/>
                    当前租户
                </Space>
            </List.Item>);
        }}
    />);
}));

const UserTool = createWithRemoteLoader({
    modules: ['components-core:Image', 'components-core:Icon', 'components-core:Global@usePreset', 'components-core:Modal@useModal', 'components-core:Global@useGlobalContext']
})((p) => {
    const {remoteModules, avatar, name, email, tenant, orgName, storeKeys, domain} = Object.assign({}, {
        storeKeys: {
            token: 'X-User-Token'
        }
    }, p)
    const [Image, Icon, usePreset, useModal, useGlobalContext] = remoteModules;
    const {ajax, apis} = usePreset();
    const modal = useModal();
    const {setGlobal} = useGlobalContext('userInfo');
    const {message} = App.useApp();
    return (<Popover
        trigger="click"
        overlayClassName={style['overlay']}
        content={<Space direction={'vertical'} className={style['content']}>
            <Space className={style['info']}>
                <Image.Avatar id={avatar} size={48}/>
                <div>
                    <div className={style['line']}>{name || '未命名'}</div>
                    <div className={style['line']}>{email || '-'}</div>
                </div>
            </Space>
            {tenant && (<Row className={style['tenant']} align="middle">
                <Col flex={1}>
                    <Space direction={'vertical'}>
                        <div className={style['company']}>{tenant.name}</div>
                        <div className={classnames(style['org'], style['company'])}>{orgName || '-'}</div>
                    </Space>
                </Col>
                <Col>
                    <Button
                        className="btn-no-padding"
                        type="link"
                        onClick={() => {
                            modal({
                                title: '切换租户', size: 'small', onConfirm: async (e, {childrenRef}) => {
                                    const {data: resData} = await ajax(Object.assign({}, apis[APP_NAME].account.setCurrentTenantId, {
                                        data: {tenantId: childrenRef.current}
                                    }));
                                    if (resData.code !== 0) {
                                        return false;
                                    }
                                    const {data: userResData} = await ajax(Object.assign({}, apis[APP_NAME].account.getTenantUserInfo));
                                    if (userResData.code !== 0) {
                                        return false;
                                    }
                                    setGlobal(userResData.data);
                                    message.success('切换租户成功');
                                    window.location.reload();
                                }, children: ({childrenRef}) => (<Fetch
                                    {...Object.assign({}, apis[APP_NAME].account.getUserTenant)}
                                    render={({data}) => {
                                        const {tenantList, userInfo} = data;
                                        return <TenantList tenantList={tenantList} ref={childrenRef}
                                                           defaultTenantId={userInfo.currentTenantId}/>;
                                    }}
                                />)
                            });
                        }}
                    >
                        切换
                        <Icon type="icon-arrow-thin-right"/>
                    </Button>
                </Col>
            </Row>)}
            <Divider className={style['divider']}/>
            <List className={style['options-list']}>
                <List.Item
                    className={style['options-list-item']}
                    onClick={() => {
                        Object.values(storeKeys).forEach(tokenKey => {
                            removeCookies(tokenKey, domain);
                        });
                        ajax(Object.assign({}, apis[APP_NAME].account.getUserInfo));
                    }}
                >
                    <Space>
                        <Icon type="icon-tuichudenglu"/>
                        <span>退出登录</span>
                    </Space>
                </List.Item>
            </List>
        </Space>}
        arrow={false}
        transitionName={'ant-slide-up'}
    >
        <Space className={style['user-tool']}>
            <Image.Avatar id={avatar} size={32}/>
            <div className={style['user-name']}>{name || '未命名'}</div>
            <Icon className={style['icon']} type="triangle-down" size={12}/>
        </Space>
    </Popover>);
});

export default UserTool;
