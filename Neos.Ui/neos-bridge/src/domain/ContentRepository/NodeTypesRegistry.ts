import * as React from 'react';

import {useGlobalRegistry} from '../Extensibility';
import {INodeType, NodeTypeName} from './NodeType';

export interface INodeTypesRegistry {
    get: (key: string) => undefined | INodeType
    getAllAsList: () => INodeType[]
    isOfType: (name: string, reference: string) => boolean
    getSubTypesOf: (name: string) => string[]
    getRole(roleName: string): NodeTypeName
}

export function useNodeTypesRegistry(): INodeTypesRegistry {
    const globalRegistry = useGlobalRegistry();
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    return nodeTypesRegistry;
}