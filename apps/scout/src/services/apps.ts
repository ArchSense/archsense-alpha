import { readdir } from 'fs/promises';
import path from 'path';
import { AppName } from '../types/app';
import { Config } from '../types/config';

export type AppPath = string;

const getDirectories = async (source: string) => {
  return (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const getAppsList = async (config: Config): Promise<string[]> => {
  if (config.include && config.include.length > 0) {
    return config.include;
  }
  const folders = await getDirectories(config.src);
  return folders.filter((name) => !(<string[]>config.exclude).includes(name));
};

export const getApps = async (config: Config): Promise<{ [name: AppName]: AppPath }> => {
  const appsNames = await getAppsList(config);
  return appsNames.reduce((acc, curr) => {
    acc[curr] = path.resolve(config.src, curr, './src/main.ts');
    return acc;
  }, {} as any);
};
