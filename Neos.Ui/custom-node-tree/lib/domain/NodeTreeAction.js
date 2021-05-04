"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilteredNodesWereReset = exports.FilteredNodesWereLoaded = exports.FilteredNodesWereRequested = exports.NodeWasToggled = exports.ChildNodesWereLoaded = exports.ChildNodesWereRequested = exports.NodesWereLoaded = exports.NodesWereRequested = void 0;
var typesafe_actions_1 = require("typesafe-actions");
exports.NodesWereRequested = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodesWereRequested')();
exports.NodesWereLoaded = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodesWereLoaded', function (rootNode, baseNodeTypeName, nodes, uncollapsedNodes) {
    return ({ rootNode: rootNode, baseNodeTypeName: baseNodeTypeName, nodes: nodes, uncollapsedNodes: uncollapsedNodes });
})();
exports.ChildNodesWereRequested = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/ChildNodesWereRequested', function (parentNode) { return parentNode; })();
exports.ChildNodesWereLoaded = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/ChildNodesWereLoaded', function (parentNode, childNodes) {
    return ({ parentNode: parentNode, childNodes: childNodes });
})();
exports.NodeWasToggled = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/NodeWasToggled', function (node, forceToggleState) {
    return ({ node: node, forceToggleState: forceToggleState });
})();
exports.FilteredNodesWereRequested = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereRequested')();
exports.FilteredNodesWereLoaded = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereLoaded', function (filteredNodes) { return filteredNodes; })();
exports.FilteredNodesWereReset = typesafe_actions_1.createAction('http://sitegeist.de/Sitegeist.Archaeopteryx/CustomNodeTree/FilteredNodesWereReset')();
//# sourceMappingURL=NodeTreeAction.js.map