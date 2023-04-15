import path from 'path';
import { AnalysisResult, Scout } from './index';
import expectedResults from '../fixtures/guinea-pig-nestjs.analysis.json';

const normalizePathsForComparison = (obj: AnalysisResult) => {
  const absolutePrefix = path.resolve(process.cwd(), '../');
  const replaceAbsolutePrefix = (str: string) => str.replace(new RegExp(absolutePrefix, 'g'), '*');
  return JSON.parse(replaceAbsolutePrefix(JSON.stringify(obj)));
};

describe('NestJs Scout', () => {
  it('should parse guinea-pig project', async () => {
    const nestjsScout = new Scout({
      framework: 'nestjs',
      rootPath: path.join(__dirname, '../../guinea-pig-nestjs'),
    });
    const res = await nestjsScout.analyze();
    expect(normalizePathsForComparison(res)).toEqual(expectedResults);
  });
});
