import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";
import {transform} from 'lodash-es';

const registryService = fp(async (fastify, options) => {
    const {models, services} = fastify[appInfo.name];
    const systemRegistry = transform(fastify.namespace.applications, (result, application, key) => {
        result[key] = application.registry;
    }, {});

    const setRegistry = ({appName, tenantId, name, value}) => {

    };

    const setRegistryByAdmin = ({appName, tenantId, name, value}) => {

    };

    services.registry = {systemRegistry, setRegistry, setRegistryByAdmin};
});

export default registryService;
