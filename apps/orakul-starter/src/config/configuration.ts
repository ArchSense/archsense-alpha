const findOption = (alias: string) => {
  const aliasIdx = process.argv.findIndex((opt) => opt === `-${alias}`);
  if (aliasIdx !== -1) {
    return process.argv[aliasIdx + 1];
  }
  return undefined;
};

export default () => {
  if (process.argv.length <= 2) {
    throw new Error('Missing parameters');
  }
  return {
    framework: process.argv[2],
    configPath: findOption('c'),
    rootPath: findOption('p'),
  };
};
