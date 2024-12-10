import {createWithRemoteLoader} from '@kne/remote-loader';

const Home = createWithRemoteLoader({
    modules: ['components-core:Layout@Page']
})(({remoteModules}) => {
    const [Page] = remoteModules;
    return (<Page noMargin noPadding>
            我是首页
        </Page>);
});

export default Home;
