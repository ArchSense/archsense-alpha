import { AppName } from './app';

export type FileIdentifier = string;

export type ParsedResult = {
  id: FileIdentifier;
  name: string;
  imports: FileIdentifier[];
  exports: {
    id: string;
    name?: string;
    apiPath?: string;
    members?: {
      id: string;
      name?: string;
      method?: string;
      apiPath?: string;
    }[];
  }[];
};

export type StaticDependenciesTree = Map<FileIdentifier, ParsedResult>;

export type AnalysisResult = {
  [key: AppName]: {
    id: AppName;
    components: { [key: FileIdentifier]: ParsedResult };
  };
};
