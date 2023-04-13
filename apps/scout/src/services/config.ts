import path from 'path';
import { Path } from '../types';
import { Config } from '../types/config';

const CONFIG_FILE_NAME = 'scout.json';

const isValidConfig = (config: Config): boolean => {
  if (!config.id) {
    throw new Error('Config is missing id');
  }
  if (!config.src) {
    throw new Error('Config is missing `src` path');
  }
  return true;
};

const completeConfig = (configPath: Path, config: Config): Config => {
  return {
    exclude: [],
    ...config,
    src: path.resolve(configPath, config.src),
  };
};

const buildConfigFromSingleProject = (rootPath: Path): Config => {
  return {
    id: 'single-project-app',
    src: path.resolve(process.cwd(), rootPath),
    include: ['.'],
    exclude: [],
  };
};

const loadConfigFile = (root: Path): Config => {
  let config;
  try {
    config = require(path.resolve(root, CONFIG_FILE_NAME));
  } catch (error) {
    throw new Error('Config file is not found in the root');
  }
  return config;
};

/**
 *
 * Returns the valid configuration whether from a file or a single project
 * `config.src` should be absolute path
 */
export const getValidConfig = (configPath?: Path, rootPath?: Path): Config | null => {
  let config: Config;
  if (configPath) {
    config = loadConfigFile(configPath);
    if (isValidConfig(config)) {
      return completeConfig(configPath, config);
    }
  }
  if (rootPath) {
    config = buildConfigFromSingleProject(rootPath);
    return config;
  }
  return null;
};
