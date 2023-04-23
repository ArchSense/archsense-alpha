import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { Decorator, MethodDeclaration, Project, SourceFile } from 'ts-morph';
import ts from 'typescript';
import { ParsedResult, StaticDependenciesTree } from '../types/output';

const TS_CONFIG_FILE_NAME = 'tsconfig.json';
const SUPPORTED_CLASS_DECORATORS = ['Controller', 'Resolver'];
const SUPPORTED_DB_DECORATORS = ['Entity', 'Schema'];
const SUPPORTED_MODULE_DECORATORS = ['Module'];
const KNOWN_API_VERBS = ['Put', 'Get', 'Post', 'Delete', 'Patch', 'Query', 'Mutation'];

const getClosestTsConfigFile = (
  projectRootDirectoryPath: string,
): { content: any; path: string } => {
  // no recursion if file is not found or file is not a valid json
  const MAX_ATTEMPTS = 8;
  let current = 0;
  let currentPath = projectRootDirectoryPath;
  while (current < MAX_ATTEMPTS) {
    try {
      const tsConfigFilePath = path.resolve(currentPath, TS_CONFIG_FILE_NAME);
      const res = readFileSync(tsConfigFilePath, { encoding: 'utf-8' });
      const { config } = ts.parseConfigFileTextToJson(TS_CONFIG_FILE_NAME, res);
      return { content: config, path: tsConfigFilePath };
    } catch (error) {
      currentPath = path.resolve(currentPath, '../');
      current++;
    }
  }
  throw new Error(`Could not find valid ${TS_CONFIG_FILE_NAME} file`);
};

const buildEmptyRecord = (id: string): ParsedResult => ({
  id,
  name: path.basename(id, '.ts'),
  imports: [],
  exports: [],
});

const removeQuotes = (name: string) => {
  const isNotQuote = (char: string) => char !== '"' && char !== "'";
  const isNotBreakLine = (char: string) => char !== '\n';
  return name.trim().split('').filter(isNotQuote).filter(isNotBreakLine).join('');
};

const buildDecoratorsMap = (decorators: Decorator[]) => {
  return decorators.reduce((acc, curr) => {
    const name = curr.getName();
    if (SUPPORTED_MODULE_DECORATORS.includes(name)) {
      acc['module'] = curr;
    }
    if (SUPPORTED_CLASS_DECORATORS.includes(name)) {
      acc['controller'] = curr;
    }
    if (SUPPORTED_DB_DECORATORS.includes(name)) {
      acc['db'] = curr;
    }
    return acc;
  }, {} as any);
}

const getApiHandlerPath = (decorator: Decorator): string => {
  if (!decorator) {
    return '';
  }
  const args = decorator.getArguments();
  if (args.length) {
    const arg = removeQuotes(args[0].getText());
    return arg.startsWith('/') ? arg : `/${arg}`;
  }
  return '/';
};

const getApiHandlerMethod = (
  method: MethodDeclaration,
  ctrlPath: string,
): { apiPath: string; method: string } => {
  const decorators = method
    .getDecorators()
    .filter((decorator) => KNOWN_API_VERBS.includes(decorator.getName()));
  if (decorators.length === 0) {
    return {
      method: '',
      apiPath: '',
    };
  }
  const decorator = decorators[0];
  return {
    apiPath: `${ctrlPath}${getApiHandlerPath(decorator)}`,
    method: decorator.getName().toUpperCase(),
  };
};

export const buildStaticInsights = async (
  projectRootFilePath: string,
): Promise<StaticDependenciesTree> => {
  const graph: StaticDependenciesTree = new Map();

  const { content: tsConfig, path: tsConfigFilePath } = getClosestTsConfigFile(
    path.parse(projectRootFilePath).dir,
  );

  const project = new Project({
    tsConfigFilePath,
    skipAddingFilesFromTsConfig: true,
  });

  const queue = [projectRootFilePath];

  while (queue.length) {
    const filePath = queue.pop() as string;

    if (graph.has(filePath)) {
      // already processed this file, avoid circular imports
      continue;
    } else {
      graph.set(filePath, buildEmptyRecord(filePath));
    }

    const sourceFile = project.addSourceFileAtPathIfExists(filePath);

    if (!sourceFile) {
      console.warn('Could not find source file for ', filePath);
    }

    sourceFile
      ?.getImportDeclarations()
      .map((declaration) => {
        return {
          sourceFile: declaration.getModuleSpecifierSourceFile()
        }
      })
      .filter(({sourceFile}) => sourceFile && !sourceFile.isFromExternalLibrary())
      .forEach(({sourceFile}) => {
        const dependencyPath = sourceFile?.getFilePath();
        if (!dependencyPath) {
          return;
        }
        graph.get(filePath)?.imports.push(dependencyPath);
        queue.push(dependencyPath);
      });

    sourceFile
      ?.getClasses()
      .filter((cls) => cls.getExportKeyword())
      .forEach((cls) => {
        const className = cls.getName() as string;
        const decorators = buildDecoratorsMap(cls.getDecorators());

        const apiPath = getApiHandlerPath(decorators['controller']);

        graph.get(filePath)?.exports.push({
          id: className,
          apiPath,
          name: className,
          tags: Object.keys(decorators),
          members: [...cls.getInstanceMethods(), ...cls.getStaticMethods()].map((method) => {
            const methodName = method.getName();
            const apiHandlerProps = getApiHandlerMethod(method, apiPath);
            return {
              id: `${className}.${methodName}`,
              name: methodName,
              ...apiHandlerProps,
            };
          }),
        });
      });
  }
  return graph;
};
