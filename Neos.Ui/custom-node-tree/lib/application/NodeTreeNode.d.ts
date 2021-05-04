import * as React from 'react';
import { INodePartialForTree } from '@sitegeist/archaeopteryx-neos-bridge';
import { INodeTreeState, NodeTreeDispatch } from '../domain';
interface Props {
    state: INodeTreeState;
    dispatch: NodeTreeDispatch;
    node: INodePartialForTree;
    selectedNode: null | INodePartialForTree;
    level: number;
    onToggle: (node: INodePartialForTree) => any;
    onClick: (node: INodePartialForTree) => any;
}
export declare const NodeTreeNode: React.FC<Props>;
export {};
