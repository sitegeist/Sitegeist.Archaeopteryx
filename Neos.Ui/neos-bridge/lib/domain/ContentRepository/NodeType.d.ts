import { Any } from 'ts-toolbelt';
export declare type NodeTypeName = Any.Type<string, 'NodeTypeName'>;
export declare function NodeTypeName(name: string): NodeTypeName;
export interface INodeType {
    name: NodeTypeName;
    label: string;
    ui?: {
        icon?: string;
    };
}
export declare function useNodeType(nodeTypeName: NodeTypeName): null | INodeType;
export declare function useNodeTypes(baseNodeTypeName: NodeTypeName): INodeType[];
