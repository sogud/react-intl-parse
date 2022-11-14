import fs from 'fs';
import path from 'path';
import log from '@/log';
import { deepAssign } from '@/utils';
import { defaultUserConfig } from './languages.config';
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
    return defaultUserConfig;
  }
  let userConfig = {};
  try {
    const { default: languagesConfig } = await import(`${userConfigPath}`);
    userConfig = languagesConfig;
  } catch (error: any) {
    log.error({
      title: `${error.name}：Failed to load the configuration file.`,
      path: userConfigPath,
      detail: error.message
    });
  }
  const combineConfig = deepAssign<NodeJS.Global['config']>(
    defaultUserConfig,
    userConfig
  );
  return combineConfig;
};

export default async () => {
  global.config = Object.assign(sysConfig, await getUserConfig());
  global.log = log;
};
