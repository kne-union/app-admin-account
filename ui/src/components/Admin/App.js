import {Routes, Route} from 'react-router-dom';
import {Provider} from '@common/context';
import InitAdminPage from './InitAdmin';
import TenantList from './Tenant/List';
import TenantDetail from './Tenant/Detail';
import UserList from './User/List';

export const InitAdmin = (p) => {
    const props = Object.assign({}, {
        baseUrl: '/admin'
    }, p);
    return (<Provider value={props}>
        <InitAdminPage/>
    </Provider>);
};

const Admin = (p) => {
    const props = Object.assign({}, {
        baseUrl: '/admin'
    }, p);

    return <Provider value={props}>
        <Routes>
            <Route index element={null}/>
            <Route path="tenant" element={<TenantList/>}/>
            <Route path="user" element={<UserList/>}/>
            <Route path="tenant/detail/:id" element={<TenantDetail/>}/>
        </Routes>
    </Provider>
};

export default Admin;
