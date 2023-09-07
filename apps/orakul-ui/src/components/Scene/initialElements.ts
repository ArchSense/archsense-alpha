/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Node } from 'reactflow';
import { buildEdge, edgeExists } from './Edge/Edge';
import { buildAbstractNode, buildActualNode, buildDBNode } from './Node/Node';
import { FileIdentifier, ParsedResult } from '@archsense/scout';

const isModule = (fileName: string) => fileName.endsWith('.module');
const isDto = (fileName: string) => fileName.endsWith('.dto');
const hasPublicMethods = (exports: unknown[]) => exports.length > 0;
const isDB = (file: ParsedResult) => {
  return file.exports.some(cls => cls.tags?.includes('db'));
};

const sanitizeComponents = (components: {
  [key: FileIdentifier]: ParsedResult;
}): Array<ParsedResult> => {
  return Object.values(components)
    .filter((component: any) => hasPublicMethods(component.exports))
    .filter((component: any) => !isDto(component.name))
    .filter((component: any) => !isModule(component.name));
};

export const initAbstractNodes = (data: any): Node[] => {
  return Object.values(data).map((node: any) =>
    buildAbstractNode(node.id, node.id),
  );
};
export const initAbstractEdges = (): Edge[] => [];

export const initModuleNodes = (data: {
  [key: FileIdentifier]: ParsedResult;
}): Node[] => {
  return Object.values(data)
    .filter((component: any) => isModule(component.name))
    .map(({ exports, id }: any) => buildActualNode({ id, data: exports[0] }));
};
export const initModuleEdges = (data: {
  [key: FileIdentifier]: ParsedResult;
}): Edge[] => {
  const modules: any[] = Object.values(data).filter((component: any) =>
    isModule(component.name),
  );
  return modules.reduce((acc: Edge[], { imports, id }) => {
    const otherModules = imports.filter((id: FileIdentifier) =>
      id.includes('.module.'),
    );
    acc.push(...otherModules.map((dep: FileIdentifier) => buildEdge(id, dep)));
    return acc;
  }, [] as Edge[]);
};

export const initCodeNodes = (data: {
  [key: FileIdentifier]: ParsedResult;
}): Node[] => {
  const relevantFiles = sanitizeComponents(data);
  const dbFiles = [],
    classFiles = [];
  for (const file of relevantFiles) {
    if (isDB(file)) {
      dbFiles.push(file);
    } else {
      classFiles.push(file);
    }
  }
  const nodes = classFiles.map(({ exports, id }) =>
    buildActualNode({ id, data: exports[0] ?? { label: id } }),
  );
  if (dbFiles.length) {
    nodes.push(buildDBNode());
  }
  return nodes;
};

export const initCodeEdges = (data: {
  [key: FileIdentifier]: ParsedResult;
}): Edge[] => {
  const relevantFiles = sanitizeComponents(data);
  const edges = [];
  const establishConnection = (
    sourceId: string,
    targetId: string,
    acc: Edge[],
  ): Edge | undefined => {
    const realTargetId = isDB(data[targetId]) ? 'db' : targetId;
    if (!edgeExists(sourceId, realTargetId, acc)) {
      return buildEdge(sourceId, realTargetId) as Edge;
    }
  };
  for (const file of relevantFiles) {
    for (const dep of file.imports) {
      const edge = establishConnection(file.id, dep, edges);
      if (edge) {
        edges.push(edge);
      }
      // const isDbDep = isDB(data[dep]);
      // edges.push(buildEdge(isDbFile ?  'db' : file.id, isDbDep ? 'db' : dep) as Edge)
    }
  }
  edges.map(({ id }) => console.log(`${id}\n`));
  return edges;
  // return sanitizeComponents(data).reduce((acc, { imports, id }) => {
  // const edges = imports.map((dep: FileIdentifier) => buildEdge(id, dep));
  //   acc.push(...edges as Edge[]);
  //   return acc;
  // }, [] as Edge[]);
};
