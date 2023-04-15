/* eslint-disable @typescript-eslint/no-explicit-any */
import { Edge, Node } from 'reactflow';
import { buildEdge } from './Edge/Edge';
import { buildAbstractNode, buildActualNode } from './Node/Node';
import { FileIdentifier, ParsedResult } from '@archsense/scout';

const isModule = (fileName: string) => fileName.endsWith('.module');
const isDto = (fileName: string) => fileName.endsWith('.dto');
const hasPublicMethods = (exports: unknown[]) => exports.length > 0;

const sanitizeComponents = (components: { [key: FileIdentifier]: ParsedResult }): Array<any> => {
  return Object.values(components)
    .filter((component: any) => hasPublicMethods(component.exports))
    .filter((component: any) => !isDto(component.name))
    .filter((component: any) => !isModule(component.name));
};

export const initAbstractNodes = (data: any): Node[] => {
  return Object.values(data).map((node: any) => buildAbstractNode(node.id, node.id));
};
export const initAbstractEdges = (): Edge[] => [];

export const initModuleNodes = (data: { [key: FileIdentifier]: ParsedResult }): Node[] => {
  return Object.values(data)
    .filter((component: any) => isModule(component.name))
    .map(({ exports, id }: any) => buildActualNode({ id, data: exports[0] }));
};
export const initModuleEdges = (data: { [key: FileIdentifier]: ParsedResult }): Edge[] => {
  const modules: any[] = Object.values(data).filter((component: any) => isModule(component.name));
  return modules.reduce((acc: Edge[], { imports, id }) => {
    const otherModules = imports.filter((id: FileIdentifier) => id.includes('.module.'));
    acc.push(...otherModules.map((dep: FileIdentifier) => buildEdge(id, dep)));
    return acc;
  }, [] as Edge[]);
};

export const initCodeNodes = (data: { [key: FileIdentifier]: ParsedResult }): Node[] => {
  return sanitizeComponents(data).map(({ exports, id }) =>
    buildActualNode({ id, data: exports[0] ?? { label: id } }),
  );
};

export const initCodeEdges = (data: { [key: FileIdentifier]: ParsedResult }): Edge[] => {
  return sanitizeComponents(data).reduce((acc, { imports, id }) => {
    const edges = imports.map((dep: FileIdentifier) => buildEdge(id, dep));
    acc.push(...edges);
    return acc;
  }, [] as Edge[]);
};
