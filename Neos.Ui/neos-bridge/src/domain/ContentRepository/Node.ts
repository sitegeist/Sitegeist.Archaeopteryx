import {Any} from 'ts-toolbelt';
import {useAsync} from 'react-use';

import {selectors} from '@neos-project/neos-ui-redux-store';

import {endpoints} from '../Backend';
import {useSelector} from '../Extensibility/Store';

import {ContextPath} from './ContextPath';
import {NodeTypeName} from './NodeType';


type NodeAggregateIdentifier = Any.Type<string, 'NodeAggregateIdentifier'>;

export interface INode {
    identifier: NodeAggregateIdentifier
    contextPath: ContextPath
    nodeType: NodeTypeName
    label: string
    depth: number
    children: {
        contextPath: ContextPath
        nodeType: NodeTypeName
    }[]
    properties: {
        _hidden: boolean
        _hiddenInIndex: boolean
    }
}

export interface INodePartialForTree {
    identifier: NodeAggregateIdentifier
    contextPath: ContextPath
    nodeType: NodeTypeName
    label: string
    depth: number
    children: {
        contextPath: ContextPath
        nodeType: NodeTypeName
    }[]
    properties: {
        _hidden: boolean
        _hiddenInIndex: boolean
    }
}

export interface INodeSummary {
    label: string
    breadcrumb: string
    nodeType: NodeTypeName
}

export function useNodeSummary(identifier: NodeAggregateIdentifier) {
    const contextForNodeLinking: any = useSelector(selectors.UI.NodeLinking.contextForNodeLinking);
    return useAsync(async () => {
        const result = await endpoints().searchNodes({
            ...contextForNodeLinking,
            nodeIdentifiers: [identifier]
        });

        if (Array.isArray(result)) {
            for (const nodeSummary of result) {
                return nodeSummary as INodeSummary;
            }
        }

        return null;
    }, [identifier]);
}

export function useHasNode(contextPath?: ContextPath) {
    const node: any = useSelector(selectors.CR.Nodes.byContextPathSelector(contextPath?.toString() ?? ''));
    return Boolean(node);
}