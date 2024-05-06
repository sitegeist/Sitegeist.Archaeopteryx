import {INodeType, NodeTypeName} from './NodeType';

export interface INodeTypesRegistry {
    get: (key: string) => undefined | INodeType
    getAllAsList: () => INodeType[]
    isOfType: (name: string, reference: string) => boolean
    getSubTypesOf: (name: string) => string[]
    getRole(roleName: string): NodeTypeName
}
