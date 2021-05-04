import { INodePartialForTree, NodeTypeName } from '@sitegeist/archaeopteryx-neos-bridge';
export declare const NodesWereRequested: import("typesafe-actions").EmptyActionCreator<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodesWereRequested">;
export declare const NodesWereLoaded: (rootNode: INodePartialForTree, baseNodeTypeName: NodeTypeName, nodes: INodePartialForTree[], uncollapsedNodes: INodePartialForTree[]) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodesWereLoaded", {
    rootNode: INodePartialForTree;
    baseNodeTypeName: NodeTypeName;
    nodes: INodePartialForTree[];
    uncollapsedNodes: INodePartialForTree[];
}>;
export declare const ChildNodesWereRequested: (parentNode: INodePartialForTree) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/ChildNodesWereRequested", INodePartialForTree>;
export declare const ChildNodesWereLoaded: (parentNode: INodePartialForTree, childNodes: INodePartialForTree[]) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/ChildNodesWereLoaded", {
    parentNode: INodePartialForTree;
    childNodes: INodePartialForTree[];
}>;
export declare const NodeWasToggled: (node: INodePartialForTree, forceToggleState?: boolean | undefined) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodeWasToggled", {
    node: INodePartialForTree;
    forceToggleState: boolean | undefined;
}>;
export declare const FilteredNodesWereRequested: import("typesafe-actions").EmptyActionCreator<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereRequested">;
export declare const FilteredNodesWereLoaded: (filteredNodes: INodePartialForTree[]) => import("typesafe-actions").PayloadAction<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereLoaded", INodePartialForTree[]>;
export declare const FilteredNodesWereReset: import("typesafe-actions").EmptyActionCreator<"http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereReset">;
