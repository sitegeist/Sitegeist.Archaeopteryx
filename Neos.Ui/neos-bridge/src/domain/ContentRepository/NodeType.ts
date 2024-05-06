import {Any} from 'ts-toolbelt';

export type NodeTypeName = Any.Type<string, 'NodeTypeName'>;
export function NodeTypeName(name: string): NodeTypeName {
    return name as NodeTypeName;
}
