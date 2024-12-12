const {CracoRemoteComponentsPlugin} = require("@kne/modules-dev");
const aliasConfig = require("./webstorm.webpack.config");
const application = require("../application.json");
process.env.CI = false;

module.exports = {
    webpack: {
        alias: aliasConfig.resolve.alias, configure: (webpackConfig) => {
            const definePlugin = webpackConfig.plugins.find((plugin) => plugin.constructor.name === "DefinePlugin");
            Object.assign(definePlugin.definitions["process.env"], {
                DEFAULT_VERSION: `"${process.env.npm_package_version}"`, APPLICATION_NAME: `"${application.name}"`
            });
            return webpackConfig;
        }
    }, plugins: [{
        plugin: CracoRemoteComponentsPlugin
    }]
};
