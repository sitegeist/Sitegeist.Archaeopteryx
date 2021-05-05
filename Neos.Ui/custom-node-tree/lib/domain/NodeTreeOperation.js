"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNodesByNodeTypeInNodeTree = exports.searchForNodesInNodeTree = exports.filterNodesInNodeTree = exports.toggleNodeInNodeTree = exports.loadNodeTree = void 0;
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var actions = __importStar(require("./NodeTreeAction"));
var NodeTreeQuery_1 = require("./NodeTreeQuery");
function loadNodeTree(_a, nodeTypesRegistry, nodeTreeConfiguration) {
    var _b;
    var dispatch = _a.dispatch;
    return __awaiter(this, void 0, void 0, function () {
        var leafNodeContextPath, toggledNodeContextPaths, nodes, rootNode;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    leafNodeContextPath = (_b = nodeTreeConfiguration.selectedNodeContextPath) !== null && _b !== void 0 ? _b : nodeTreeConfiguration.documentNodeContextPath;
                    toggledNodeContextPaths = nodeTreeConfiguration.rootNodeContextPath
                        .getIntermediateContextPaths(leafNodeContextPath);
                    dispatch(actions.NodesWereRequested());
                    return [4, archaeopteryx_neos_bridge_1.q([
                            nodeTreeConfiguration.rootNodeContextPath,
                            leafNodeContextPath
                        ]).neosUiDefaultNodes(nodeTreeConfiguration.baseNodeTypeName, nodeTreeConfiguration.loadingDepth, toggledNodeContextPaths, []).getForTree()];
                case 1:
                    nodes = (_c.sent()).map(function (node) { return (__assign(__assign({}, node), { children: node.children.filter(function (_a) {
                            var nodeTypeName = _a.nodeType;
                            return Boolean(nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.isOfType(nodeTypeName, nodeTreeConfiguration.baseNodeTypeName));
                        }) })); });
                    rootNode = nodes.find(function (n) { return n.contextPath.equals(nodeTreeConfiguration.rootNodeContextPath); });
                    if (!rootNode) {
                        throw new Error("Could not find root node: " + nodeTreeConfiguration.rootNodeContextPath);
                    }
                    dispatch(actions.NodesWereLoaded(rootNode, nodeTreeConfiguration.baseNodeTypeName, nodes, nodes.filter(function (node) { return false
                        || toggledNodeContextPaths.some(function (cp) { return node.contextPath.equals(cp); })
                        || node.depth - rootNode.depth < nodeTreeConfiguration.loadingDepth; })));
                    return [2];
            }
        });
    });
}
exports.loadNodeTree = loadNodeTree;
function toggleNodeInNodeTree(_a, nodeTypesRegistry, node) {
    var state = _a.state, dispatch = _a.dispatch;
    return __awaiter(this, void 0, void 0, function () {
        var childNodeContextPaths, childNodes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!state.nodesByState.uncollapsed.includes(node)) return [3, 1];
                    dispatch(actions.NodeWasToggled(node, false));
                    return [3, 4];
                case 1:
                    if (!NodeTreeQuery_1.isNodeFullyLoaded(state, node)) return [3, 2];
                    dispatch(actions.NodeWasToggled(node, true));
                    return [3, 4];
                case 2:
                    childNodeContextPaths = node.children
                        .filter(function (c) { return !state.nodesByContextPath.all[c.contextPath.toString()]; })
                        .map(function (c) { return c.contextPath; });
                    dispatch(actions.ChildNodesWereRequested(node));
                    return [4, archaeopteryx_neos_bridge_1.q(childNodeContextPaths).getForTree()];
                case 3:
                    childNodes = (_b.sent()).map(function (node) { return (__assign(__assign({}, node), { children: node.children.filter(function (_a) {
                            var nodeTypeName = _a.nodeType;
                            return Boolean(nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.isOfType(nodeTypeName, state.baseNodeTypeName));
                        }) })); });
                    dispatch(actions.ChildNodesWereLoaded(node, childNodes));
                    dispatch(actions.NodeWasToggled(node, true));
                    _b.label = 4;
                case 4: return [2];
            }
        });
    });
}
exports.toggleNodeInNodeTree = toggleNodeInNodeTree;
function filterNodesInNodeTree(_a, nodeTypesRegistry, nodeTreeFilterParams) {
    var _b, _c;
    var state = _a.state, dispatch = _a.dispatch;
    return __awaiter(this, void 0, void 0, function () {
        var filteredNodes;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(state.rootNode && (nodeTreeFilterParams.searchTerm || nodeTreeFilterParams.nodeTypeFilter))) return [3, 2];
                    dispatch(actions.FilteredNodesWereRequested(nodeTreeFilterParams.searchTerm, nodeTreeFilterParams.nodeTypeFilter));
                    return [4, archaeopteryx_neos_bridge_1.q(state.rootNode.contextPath)
                            .search((_b = nodeTreeFilterParams.searchTerm) !== null && _b !== void 0 ? _b : undefined, (_c = nodeTreeFilterParams.nodeTypeFilter) !== null && _c !== void 0 ? _c : undefined)
                            .getForTreeWithParents()];
                case 1:
                    filteredNodes = (_d.sent()).map(function (node) { return (__assign(__assign({}, node), { children: node.children.filter(function (_a) {
                            var nodeTypeName = _a.nodeType;
                            return Boolean(nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.isOfType(nodeTypeName, state.baseNodeTypeName));
                        }) })); });
                    ;
                    dispatch(actions.FilteredNodesWereLoaded(filteredNodes));
                    return [3, 3];
                case 2:
                    dispatch(actions.FilteredNodesWereReset());
                    _d.label = 3;
                case 3: return [2];
            }
        });
    });
}
exports.filterNodesInNodeTree = filterNodesInNodeTree;
function searchForNodesInNodeTree(_a, nodeTypesRegistry, searchTerm) {
    var state = _a.state, dispatch = _a.dispatch;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, filterNodesInNodeTree({ state: state, dispatch: dispatch }, nodeTypesRegistry, __assign(__assign({}, state.filterParams), { searchTerm: searchTerm }))];
                case 1:
                    _b.sent();
                    return [2];
            }
        });
    });
}
exports.searchForNodesInNodeTree = searchForNodesInNodeTree;
function filterNodesByNodeTypeInNodeTree(_a, nodeTypesRegistry, nodeTypeFilter) {
    var state = _a.state, dispatch = _a.dispatch;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, filterNodesInNodeTree({ state: state, dispatch: dispatch }, nodeTypesRegistry, __assign(__assign({}, state.filterParams), { nodeTypeFilter: nodeTypeFilter }))];
                case 1:
                    _b.sent();
                    return [2];
            }
        });
    });
}
exports.filterNodesByNodeTypeInNodeTree = filterNodesByNodeTypeInNodeTree;
//# sourceMappingURL=NodeTreeOperation.js.map