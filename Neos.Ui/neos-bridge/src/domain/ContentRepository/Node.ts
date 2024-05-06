import {Any} from 'ts-toolbelt';

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

export interface INodeSummary {
    label: string
    breadcrumb: string
    nodeType: NodeTypeName
}
