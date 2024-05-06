import {Any} from 'ts-toolbelt';

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

