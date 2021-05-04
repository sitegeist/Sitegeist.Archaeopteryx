"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChildNodesForNode = exports.findNodeByContextPath = exports.isNodeFullyLoaded = exports.isNodeLoading = exports.isNodeCollapsed = void 0;
function isNodeCollapsed(state, node) {
    if (state.nodesByContextPath.filtered) {
        return false;
    }
    return !state.nodesByState.uncollapsed
        .some(function (n) { return n.contextPath.equals(node.contextPath); });
}
exports.isNodeCollapsed = isNodeCollapsed;
function isNodeLoading(state, node) {
    if (state.nodesByContextPath.filtered) {
        return false;
    }
    return state.nodesByState.loading
        .some(function (n) { return n.contextPath.equals(node.contextPath); });
}
exports.isNodeLoading = isNodeLoading;
function isNodeFullyLoaded(state, node) {
    if (state.nodesByContextPath.filtered) {
        return true;
    }
    return node.children.every(function (child) { return state.nodesByContextPath.all[child.contextPath.toString()]; });
}
exports.isNodeFullyLoaded = isNodeFullyLoaded;
function findNodeByContextPath(state, contextPath) {
    var _a, _b;
    var repository = (_a = state.nodesByContextPath.filtered) !== null && _a !== void 0 ? _a : state.nodesByContextPath.all;
    return (_b = repository[contextPath.toString()]) !== null && _b !== void 0 ? _b : null;
}
exports.findNodeByContextPath = findNodeByContextPath;
function findChildNodesForNode(state, node) {
    if (!isNodeFullyLoaded(state, node)) {
        return [];
    }
    return node.children.map(function (child) { return findNodeByContextPath(state, child.contextPath); }).filter(function (result) { return result !== null; });
}
exports.findChildNodesForNode = findChildNodesForNode;
//# sourceMappingURL=NodeTreeQuery.js.map