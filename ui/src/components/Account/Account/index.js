import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import classnames from 'classnames';
import {merge} from 'lodash-es';
import {Provider} from '@common/context';
import style from './style.module.scss';

const Layout = () => {
    return (<div className={classnames(style['layout-row'], 'account-layout')}>
        <div className={style['layout-inner']}>
            <div className={style['layout-inner-wrapper']}>
                <Outlet/>
            </div>
        </div>
    </div>);
};

const Account = ({className, ...p}) => {
    const {baseUrl, ...props} = merge({}, {
        baseUrl: '/', isTenant: false, storeKeys: {
            token: 'X-User-Token'
        }
    }, p);
    return <Provider value={{baseUrl, ...props}}>
        <div className={className}>
            <Routes>
                <Route element={<Layout/>}>
                    <Route index element={<Navigate to={`${baseUrl}/login`}/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                    {/*<Route path="forget" element={<Forget/>}/>
                    <Route path="reset-password/:token" element={<ResetPassword/>}/>
                    <Route path="modify/:email" element={<Modify/>}/>*/}
                </Route>
            </Routes>
        </div>
    </Provider>
};

export default Account;
