import {createAction} from 'typesafe-actions';

import {INodePartialForTree, NodeTypeName} from '@sitegeist/archaeopteryx-neos-bridge';

export const NodesWereRequested = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodesWereRequested'
)();

export const NodesWereLoaded = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodesWereLoaded',
    (rootNode: INodePartialForTree, baseNodeTypeName: NodeTypeName, nodes: INodePartialForTree[], uncollapsedNodes: INodePartialForTree[]) =>
        ({rootNode, baseNodeTypeName, nodes, uncollapsedNodes})
)();

export const ChildNodesWereRequested = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/ChildNodesWereRequested',
    (parentNode: INodePartialForTree) => parentNode
)();

export const ChildNodesWereLoaded = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/ChildNodesWereLoaded',
    (parentNode: INodePartialForTree, childNodes: INodePartialForTree[]) =>
        ({parentNode, childNodes})
)();

export const NodeWasToggled = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodeWasToggled',
    (node: INodePartialForTree, forceToggleState?: boolean) =>
        ({node, forceToggleState})
)();

export const FilteredNodesWereRequested = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereRequested',
    (searchTerm: null | string, nodeTypeFilter: null | NodeTypeName) =>
        ({searchTerm, nodeTypeFilter})
)();

export const FilteredNodesWereLoaded = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereLoaded',
    (filteredNodes: INodePartialForTree[]) => filteredNodes
)();

export const FilteredNodesWereReset = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereReset'
)();