import fs from 'fs';
import path from 'path';
import log from '@/log';
import { merge } from 'lodash';
import defaultLanguagesConfig from './languages.config';
import loadConfigFile from '@/loadConfigFile';
export const basePath = process.cwd();
export const pkgBasePath = path.resolve(__dirname, '../');
export const pkg = require(`${pkgBasePath}/package.json`);

const sysConfig = {
  basePath,
  pkgBasePath,
  pkg
};
const userConfigPath = path.join(basePath, 'languages.config.js');

const getUserConfig = async () => {
  if (!fs.existsSync(userConfigPath)) {
    return defaultLanguagesConfig;
  }
  let userConfig = {};
  try {
    // const { default: sourceFile } = await import(`${userConfigPath}`);
    const [sourceFile = {}] = await loadConfigFile(userConfigPath);
    userConfig = sourceFile;
  } catch (error: any) {
    log.error({
      title: `${error.name}：Failed to load the configuration file.`,
      path: userConfigPath,
      detail: error.message
    });
  }
  const combineConfig = merge(defaultLanguagesConfig, userConfig);
  return combineConfig;
};

export default async () => {
  global.config = Object.assign(sysConfig, await getUserConfig());
  global.log = log;
};
