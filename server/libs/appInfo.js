import {camelCase, last} from "lodash-es";
import {readJson} from "fs-extra/esm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const appDir = path.dirname(path.resolve(fileURLToPath(import.meta.url), '../'));
const application = await readJson(path.resolve(appDir, '../application.json'));
const apiVersion = application.version.split('.')[0];
const appInfo = Object.assign({}, application, {apiVersion, appDir});

export default appInfo;
