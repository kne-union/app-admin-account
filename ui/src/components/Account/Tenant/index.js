import {Space, Empty, Button} from 'antd';
import {LeftOutlined} from '@ant-design/icons';
import style from './style.module.scss';
import commonStyle from '../style.module.scss';
import classnames from 'classnames';
import {createWithRemoteLoader} from '@kne/remote-loader';

export const TenantForm = ({data, onChange}) => {
    return (
        <>
            <Space direction="vertical" className={classnames('full-space', style['tenant-wrapper'])}>
                {(data || []).map(item => {
                    return (
                        <Space
                            key={item.id}
                            direction="vertical"
                            className={classnames('full-space', style['tenant-list'])}
                            onClick={() => {
                                onChange && onChange(item);
                            }}
                        >
                            <div className={classnames(style['tenant-item'], 'ellipse')} key={item.id}>
                                {item.name}
                            </div>
                        </Space>
                    );
                })}
            </Space>
            {(data || []).length === 0 &&
                <Empty description="暂无可选择的租户,请联系管理员" image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
        </>
    );
};

const Tenant = createWithRemoteLoader({
    modules: ['components-core:Common@SimpleBar']
})(({remoteModules, data, onChange, onBack}) => {
    const [SimpleBar] = remoteModules;
    return (
        <>
            <Button className={commonStyle['back-link']} type="link" size="large" onClick={onBack}
                    icon={<LeftOutlined/>}>返回</Button>
            <Space className="full-space" size={40} direction="vertical">
                <div className={commonStyle['title']}>登录</div>
                <Space className="full-space" direction="vertical">
                    <span className={style['sub-title']}>选择需要登录的企业</span>
                    <SimpleBar className={style['main']}>
                        <TenantForm data={data} onChange={onChange}/>
                    </SimpleBar>
                </Space>
            </Space>
        </>
    );
});

export default Tenant;
