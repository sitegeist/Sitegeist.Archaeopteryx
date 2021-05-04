import { ActionType } from 'typesafe-actions';
import { INodePartialForTree, NodeTypeName } from '@sitegeist/archaeopteryx-neos-bridge';
import * as actions from './NodeTreeAction';
export interface INodeTreeState {
    rootNode: null | INodePartialForTree;
    baseNodeTypeName: NodeTypeName;
    nodesByContextPath: {
        all: {
            [contextPath: string]: INodePartialForTree;
        };
        filtered: null | {
            [contextPath: string]: INodePartialForTree;
        };
    };
    nodesByState: {
        uncollapsed: INodePartialForTree[];
        loading: INodePartialForTree[];
    };
}
export declare const initialNodeTreeState: INodeTreeState;
export declare function nodeTreeReducer(state: INodeTreeState | undefined, action: ActionType<typeof actions>): INodeTreeState;
