import { ActionType } from 'typesafe-actions';
import { INodePartialForTree, INodeTypesRegistry, NodeTypeName, ContextPath } from '@sitegeist/archaeopteryx-neos-bridge';
import * as actions from './NodeTreeAction';
import { INodeTreeState } from './NodeTreeState';
interface Store {
    state: INodeTreeState;
    dispatch(action: ActionType<typeof actions>): void;
}
export declare function loadNodeTree({ dispatch }: Store, nodeTypesRegistry: INodeTypesRegistry, nodeTreeConfiguration: {
    rootNodeContextPath: ContextPath;
    baseNodeTypeName: NodeTypeName;
    loadingDepth: number;
    documentNodeContextPath: ContextPath;
    selectedNodeContextPath?: ContextPath;
}): Promise<void>;
export declare function toggleNodeInNodeTree({ state, dispatch }: Store, nodeTypesRegistry: INodeTypesRegistry, node: INodePartialForTree): Promise<void>;
export declare function filterNodeTree({ state, dispatch }: Store, nodeTypesRegistry: INodeTypesRegistry, nodeTreeFilterParams: {
    searchTerm: null | string;
    nodeTypeFilter: null | NodeTypeName;
}): Promise<void>;
export {};
