import {camelCase, last} from "lodash-es";
import {readJson} from "fs-extra/esm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const appDir = path.dirname(path.resolve(fileURLToPath(import.meta.url), '../'));
const packageJson = await readJson(path.resolve(appDir, '../package.json'));
const application = await readJson(path.resolve(appDir, '../application.json'));
const appName = camelCase(last(packageJson.name.split('/')));
const apiVersion = packageJson.version.split('.')[0];
const appInfo = Object.assign({}, application, {name: appName, version: packageJson.version, apiVersion, appDir});

export default appInfo;
