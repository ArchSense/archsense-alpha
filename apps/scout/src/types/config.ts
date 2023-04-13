import { AppName } from './app';
import { Path } from './path';

export type Config = {
  id: string;
  src: Path;
  include?: AppName[];
  exclude?: AppName[];
};
