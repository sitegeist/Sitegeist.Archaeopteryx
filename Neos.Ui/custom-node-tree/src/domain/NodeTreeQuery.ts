import {INodePartialForTree, ContextPath} from '@sitegeist/archaeopteryx-neos-bridge';

import {INodeTreeState} from './NodeTreeState';

export function isNodeCollapsed(
    state: INodeTreeState,
    node: INodePartialForTree
): boolean {
    if (state.nodesByContextPath.filtered) {
        return false;
    }

    return !state.nodesByState.uncollapsed
        .some(n => n.contextPath.equals(node.contextPath));
}

export function isNodeLoading(
    state: INodeTreeState,
    node: INodePartialForTree
): boolean {
    if (state.nodesByContextPath.filtered) {
        return false;
    }

    return state.nodesByState.loading
        .some(n => n.contextPath.equals(node.contextPath));
}

export function isNodeFullyLoaded(
    state: INodeTreeState,
    node: INodePartialForTree
): boolean {
    if (state.nodesByContextPath.filtered) {
        return true;
    }

    return node.children.every(
        child => state.nodesByContextPath.all[child.contextPath.toString()]
    );
}

export function findNodeByContextPath(
    state: INodeTreeState,
    contextPath: ContextPath
): null | INodePartialForTree {
    const repository = state.nodesByContextPath.filtered
        ?? state.nodesByContextPath.all;

    return repository[contextPath.toString()] ?? null;
}

export function findChildNodesForNode(
    state: INodeTreeState,
    node: INodePartialForTree
): INodePartialForTree[] {
    return node.children.map(
        child => findNodeByContextPath(state, child.contextPath)
    ).filter(result => result !== null) as INodePartialForTree[];
}
