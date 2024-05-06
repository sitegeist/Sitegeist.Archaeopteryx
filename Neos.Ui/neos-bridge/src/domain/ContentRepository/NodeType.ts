import {Any} from 'ts-toolbelt';
import { useNodeTypesRegistry } from './NodeTypesRegistry';

export type NodeTypeName = Any.Type<string, 'NodeTypeName'>;
export function NodeTypeName(name: string): NodeTypeName {
    return name as NodeTypeName;
}

export interface INodeType {
    name: NodeTypeName
    label: string
    ui?: {
        icon?: string
    }
}

export function useNodeTypes(baseNodeTypeName: NodeTypeName): INodeType[] {
    const nodeTypesRegistry = useNodeTypesRegistry();
    return nodeTypesRegistry.getSubTypesOf(baseNodeTypeName).map(
        nodeTypeName => nodeTypesRegistry?.get(nodeTypeName)
    ).filter(n => n) as INodeType[] ?? [];
}
