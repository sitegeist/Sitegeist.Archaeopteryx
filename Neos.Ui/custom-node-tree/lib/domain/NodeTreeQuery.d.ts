import { INodePartialForTree, ContextPath } from '@sitegeist/archaeopteryx-neos-bridge';
import { INodeTreeState } from './NodeTreeState';
export declare function isNodeCollapsed(state: INodeTreeState, node: INodePartialForTree): boolean;
export declare function isNodeLoading(state: INodeTreeState, node: INodePartialForTree): boolean;
export declare function isNodeFullyLoaded(state: INodeTreeState, node: INodePartialForTree): boolean;
export declare function findNodeByContextPath(state: INodeTreeState, contextPath: ContextPath): null | INodePartialForTree;
export declare function findChildNodesForNode(state: INodeTreeState, node: INodePartialForTree): INodePartialForTree[];
