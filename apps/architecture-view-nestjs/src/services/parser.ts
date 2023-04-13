import { Scout, AnalysisResult } from '@archsense/scout';

export const analyze = (rootPath: string): Promise<AnalysisResult> => {
  const nestjsScout = new Scout({
    framework: 'nestjs',
    rootPath,
  });
  return nestjsScout.analyze();
};
