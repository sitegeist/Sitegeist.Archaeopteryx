import produce from 'immer';
import {ActionType, getType} from 'typesafe-actions';

import {INodePartialForTree, NodeTypeName} from '@sitegeist/archaeopteryx-neos-bridge';

import * as actions from './NodeTreeAction';

export interface INodeTreeState {
    rootNode: null | INodePartialForTree
    baseNodeTypeName: NodeTypeName
    nodesByContextPath: {
        all: {
            [contextPath: string]: INodePartialForTree
        }
        filtered: null | {
            [contextPath: string]: INodePartialForTree
        }
    }
    nodesByState: {
        uncollapsed: INodePartialForTree[]
        loading: INodePartialForTree[]
    }
}

export const initialNodeTreeState: INodeTreeState = {
    rootNode: null,
    baseNodeTypeName: NodeTypeName('Neos.Neos:Document'),
    nodesByContextPath: {
        all: {},
        filtered: null
    },
    nodesByState: {
        uncollapsed: [],
        loading: []
    }
};

export function nodeTreeReducer(
    state: INodeTreeState = initialNodeTreeState,
    action: ActionType<typeof actions>
): INodeTreeState {
    switch (action.type) {
        case getType(actions.NodesWereLoaded): return produce(state, draft => {
            draft.rootNode = action.payload.rootNode;
            draft.baseNodeTypeName = action.payload.baseNodeTypeName;
            draft.nodesByContextPath.filtered = null;
            draft.nodesByState.loading = state.nodesByState.loading.filter(
                node => node !== state.rootNode
            );
            draft.nodesByState.uncollapsed = action.payload.uncollapsedNodes;

            for (const node of action.payload.nodes) {
                draft.nodesByContextPath.all[node.contextPath.toString()] = node;
            }
        });

        case getType(actions.ChildNodesWereRequested): return produce(state, draft => {
            draft.nodesByState.loading.push(action.payload);
        });

        case getType(actions.ChildNodesWereLoaded): return produce(state, draft => {
            draft.nodesByState.loading = state.nodesByState.loading.filter(
                node => node !== action.payload.parentNode
            );

            for (const node of action.payload.childNodes) {
                draft.nodesByContextPath.all[node.contextPath.toString()] = node;
            }
        });

        case getType(actions.NodeWasToggled): return produce(state, draft => {
            const isUncollapsed = action.payload.forceToggleState
                ?? state.nodesByState.uncollapsed.includes(action.payload.node);

            if (isUncollapsed) {
                draft.nodesByState.uncollapsed = state.nodesByState.uncollapsed.filter(
                    node => node !== action.payload.node
                );
            } else {
                draft.nodesByState.uncollapsed.push(action.payload.node);
            }
        });

        case getType(actions.FilteredNodesWereRequested): return produce(state, draft => {
            if (state.rootNode && !state.nodesByState.loading.includes(state.rootNode)) {
                draft.nodesByState.loading.push(state.rootNode);
            }

            draft.nodesByContextPath.filtered = {};
        });

        case getType(actions.FilteredNodesWereLoaded): return produce(state, draft => {
            draft.nodesByState.loading = state.nodesByState.loading.filter(
                node => node !== state.rootNode
            );
            draft.nodesByContextPath.filtered = {};

            for (const node of action.payload) {
                draft.nodesByContextPath.filtered[node.contextPath.toString()] = node;
            }
        });

        case getType(actions.FilteredNodesWereReset): return produce(state, draft => {
            draft.nodesByState.loading = state.nodesByState.loading.filter(
                node => node !== state.rootNode
            );
            draft.nodesByContextPath.filtered = null;
        });

        default:
            return state;
    }
}