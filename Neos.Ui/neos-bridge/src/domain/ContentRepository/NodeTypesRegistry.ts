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

export function useNodeTypesRegistry(): null | INodeTypesRegistry {
    const globalRegistry = useGlobalRegistry();
    const [result, setResult] = React.useState<null | INodeTypesRegistry>(null);

    React.useEffect(() => {
        if (globalRegistry) {
            setResult(globalRegistry.get('@neos-project/neos-ui-contentrepository'));
        }
    }, [globalRegistry]);

    return result;
}