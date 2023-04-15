import path from 'path';
import { Scout } from './index';
import expectedResults from '../fixtures/guinea-pig-nestjs.analysis.json';

describe('NestJs Scout', () => {
  it('should parse guinea-pig project', async () => {
    const nestjsScout = new Scout({
      framework: 'nestjs',
      rootPath: path.join(__dirname, '../../guinea-pig-nestjs'),
    });
    const res = await nestjsScout.analyze();
    expect(res).toEqual(expectedResults);
  });
});
