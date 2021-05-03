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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTreeAdapter = void 0;
var React = __importStar(require("react"));
var immer_1 = require("immer");
var react_use_1 = require("react-use");
var react_ui_components_1 = require("@neos-project/react-ui-components");
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
function useOperation() {
    var _a = __read(React.useState(false), 2), loading = _a[0], setLoading = _a[1];
    var _b = __read(React.useState(null), 2), error = _b[0], setError = _b[1];
    function start() {
        setLoading(true);
    }
    function fail(reason) {
        setError(reason);
        setLoading(false);
    }
    function succeed() {
        setLoading(false);
    }
    return { loading: loading, error: error, start: start, fail: fail, succeed: succeed };
}
function useBaseNodeTypeName() {
    var baseNodeTypeName = archaeopteryx_neos_bridge_1.useConfiguration(function (c) { var _a, _b, _c; return (_c = (_b = (_a = c.nodeTree) === null || _a === void 0 ? void 0 : _a.presets) === null || _b === void 0 ? void 0 : _b.default) === null || _c === void 0 ? void 0 : _c.baseNodeType; });
    return baseNodeTypeName !== null && baseNodeTypeName !== void 0 ? baseNodeTypeName : archaeopteryx_neos_bridge_1.NodeTypeName('Neos.Neos:Document');
}
function useTree(startingPoint, selectedPath) {
    var _this = this;
    var _a, _b;
    var initialization = useOperation();
    var _c = __read(React.useState({
        nodesByContextPath: {},
        filteredNodesByContextPath: null,
        searchTerm: null,
        nodeTypeFilter: null,
        rootNodeContextPath: null,
        open: [],
        loading: []
    }), 2), treeState = _c[0], setTreeState = _c[1];
    var siteNodeContextPath = archaeopteryx_neos_bridge_1.useSiteNodeContextPath();
    var documentNodeContextPath = archaeopteryx_neos_bridge_1.useDocumentNodeContextPath();
    var baseNodeTypeName = useBaseNodeTypeName();
    var loadingDepth = (_a = archaeopteryx_neos_bridge_1.useConfiguration(function (c) { var _a; return (_a = c.nodeTree) === null || _a === void 0 ? void 0 : _a.loadingDepth; })) !== null && _a !== void 0 ? _a : 4;
    var nodeTypesRegistry = archaeopteryx_neos_bridge_1.useNodeTypesRegistry();
    var filterNodes = function (nodes) { return nodes.map(function (node) { return (__assign(__assign({}, node), { children: node.children.filter(function (_a) {
            var nodeTypeName = _a.nodeType;
            return Boolean(nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.isOfType(nodeTypeName, baseNodeTypeName));
        }) })); }); };
    var markAsLoading = function (node) {
        setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
            draft.loading.push(node.contextPath.toString());
        }); });
    };
    var unmarkAsLoading = function (node) {
        setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
            var e_1, _a;
            try {
                for (var _b = __values(treeState.loading.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), index = _d[0], c = _d[1];
                    if (c === node.contextPath.toString()) {
                        draft.loading.splice(index, 1);
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }); });
    };
    var toggle = function (node) { return __awaiter(_this, void 0, void 0, function () {
        var children, nodes_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!treeState.open.includes(node.contextPath.toString())) return [3, 1];
                    setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
                        var e_2, _a;
                        try {
                            for (var _b = __values(treeState.open.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var _d = __read(_c.value, 2), index = _d[0], c = _d[1];
                                if (c === node.contextPath.toString()) {
                                    draft.open.splice(index, 1);
                                    break;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }); });
                    return [3, 4];
                case 1:
                    if (!node.children.every(function (c) { return Boolean(treeState.nodesByContextPath[c.contextPath.toString()]); })) return [3, 2];
                    setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
                        draft.open.push(node.contextPath.toString());
                    }); });
                    return [3, 4];
                case 2:
                    children = node.children
                        .filter(function (c) { return !Boolean(treeState.nodesByContextPath[c.contextPath.toString()]); })
                        .map(function (c) { return c.contextPath; });
                    markAsLoading(node);
                    return [4, archaeopteryx_neos_bridge_1.q(children).getForTree()];
                case 3:
                    nodes_1 = _a.sent();
                    setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
                        var e_3, _a;
                        try {
                            for (var _b = __values(filterNodes(nodes_1)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var node_1 = _c.value;
                                draft.nodesByContextPath[node_1.contextPath.toString()] = node_1;
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        draft.open.push(node.contextPath.toString());
                    }); });
                    unmarkAsLoading(node);
                    _a.label = 4;
                case 4: return [2];
            }
        });
    }); };
    var search = function (searchTerm) {
        setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
            draft.searchTerm = searchTerm;
        }); });
    };
    var filter = function (nodeTypeName) {
        setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
            draft.nodeTypeFilter = nodeTypeName;
        }); });
    };
    React.useEffect(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var root, selected, toggled_1, nodes_2, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        root = (_a = siteNodeContextPath === null || siteNodeContextPath === void 0 ? void 0 : siteNodeContextPath.adopt(startingPoint)) !== null && _a !== void 0 ? _a : siteNodeContextPath;
                        if (!(root && documentNodeContextPath)) return [3, 4];
                        selected = documentNodeContextPath === null || documentNodeContextPath === void 0 ? void 0 : documentNodeContextPath.adopt(selectedPath);
                        toggled_1 = root.getIntermediateContextPaths(selected !== null && selected !== void 0 ? selected : documentNodeContextPath);
                        initialization.start();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4, archaeopteryx_neos_bridge_1.q([root, selected !== null && selected !== void 0 ? selected : documentNodeContextPath]).neosUiDefaultNodes(baseNodeTypeName, loadingDepth, toggled_1, []).getForTree()];
                    case 2:
                        nodes_2 = _b.sent();
                        setTreeState(immer_1.produce(treeState, function (draft) {
                            var e_4, _a;
                            try {
                                for (var _b = __values(filterNodes(nodes_2)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    var node = _c.value;
                                    draft.nodesByContextPath[node.contextPath.toString()] = node;
                                    if (toggled_1.includes(node.contextPath) || node.depth - root.depth < loadingDepth) {
                                        draft.open.push(node.contextPath.toString());
                                    }
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            draft.rootNodeContextPath = root;
                        }));
                        initialization.succeed();
                        return [3, 4];
                    case 3:
                        err_1 = _b.sent();
                        initialization.fail(err_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); })();
    }, [siteNodeContextPath, documentNodeContextPath, startingPoint]);
    react_use_1.useDebounce(function () {
        var root = siteNodeContextPath === null || siteNodeContextPath === void 0 ? void 0 : siteNodeContextPath.adopt(startingPoint);
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var nodes_3, err_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(root && (treeState.searchTerm || treeState.nodeTypeFilter))) return [3, 5];
                        initialization.start();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4, archaeopteryx_neos_bridge_1.q(root)
                                .search((_a = treeState.searchTerm) !== null && _a !== void 0 ? _a : undefined, (_b = treeState.nodeTypeFilter) !== null && _b !== void 0 ? _b : undefined)
                                .getForTreeWithParents()];
                    case 2:
                        nodes_3 = _c.sent();
                        setTreeState(immer_1.produce(treeState, function (draft) {
                            var e_5, _a;
                            draft.filteredNodesByContextPath = {};
                            if (treeState.rootNodeContextPath) {
                                draft.filteredNodesByContextPath[treeState.rootNodeContextPath.toString()] =
                                    treeState.nodesByContextPath[treeState.rootNodeContextPath.toString()];
                            }
                            try {
                                for (var _b = __values(filterNodes(nodes_3)), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    var node = _c.value;
                                    draft.filteredNodesByContextPath[node.contextPath.toString()] = node;
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }));
                        initialization.succeed();
                        return [3, 4];
                    case 3:
                        err_2 = _c.sent();
                        initialization.fail(err_2);
                        return [3, 4];
                    case 4: return [3, 6];
                    case 5:
                        setTreeState(immer_1.produce(treeState, function (draft) {
                            draft.filteredNodesByContextPath = null;
                        }));
                        _c.label = 6;
                    case 6: return [2];
                }
            });
        }); })();
    }, 500, [siteNodeContextPath, startingPoint, treeState.searchTerm, treeState.nodeTypeFilter]);
    return {
        treeState: __assign(__assign({}, treeState), { nodesByContextPath: (_b = treeState.filteredNodesByContextPath) !== null && _b !== void 0 ? _b : treeState.nodesByContextPath }),
        toggle: toggle,
        search: search,
        filter: filter,
        isFiltered: Boolean(treeState.filteredNodesByContextPath),
        loading: initialization.loading,
        error: initialization.error
    };
}
var NodeTreeAdapter = function (props) {
    var _a, _b, _c, _d;
    var _e = useTree(undefined, (_a = props.selected) === null || _a === void 0 ? void 0 : _a.contextPath.toString()), loading = _e.loading, error = _e.error, treeState = _e.treeState, toggle = _e.toggle, search = _e.search, filter = _e.filter, isFiltered = _e.isFiltered;
    var handleToggle = function (node) { return toggle(node); };
    var handleClick = function (node) { return props.onSelect(node); };
    var treeView;
    if (loading) {
        treeView = (React.createElement("div", null, "Loading..."));
    }
    else if (error) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
        console.error(error);
        treeView = (React.createElement("div", null, "An error occurred :("));
    }
    else {
        var rootNode = treeState.nodesByContextPath[(_c = (_b = treeState.rootNodeContextPath) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : ''];
        if (rootNode) {
            treeView = (React.createElement(react_ui_components_1.Tree, null,
                React.createElement(NodeAdapter, { selected: props.selected, node: rootNode, tree: treeState, level: 1, isFiltered: isFiltered, onToggle: handleToggle, onClick: handleClick })));
        }
        else {
            treeView = null;
        }
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("input", { type: "text", onChange: function (ev) { return search(ev.target.value || null); }, value: (_d = treeState.searchTerm) !== null && _d !== void 0 ? _d : '' }),
        React.createElement(NodeTypeFilter, { value: treeState.nodeTypeFilter, onSelect: function (nodeType) { var _a; return filter((_a = nodeType === null || nodeType === void 0 ? void 0 : nodeType.name) !== null && _a !== void 0 ? _a : null); } }),
        treeView));
};
exports.NodeTreeAdapter = NodeTreeAdapter;
var NodeAdapter = function (props) {
    var _a, _b, _c;
    var nodeType = archaeopteryx_neos_bridge_1.useNodeType(props.node.nodeType);
    var handleNodeToggle = function () { return props.onToggle(props.node); };
    var handleNodeClick = function () { return props.onClick(props.node); };
    var isCollapsed = !props.tree.open.includes(props.node.contextPath.toString()) && !props.isFiltered;
    var isLoading = props.tree.loading.includes(props.node.contextPath.toString());
    return (React.createElement(react_ui_components_1.Tree.Node, null,
        React.createElement(react_ui_components_1.Tree.Node.Header, { labelIdentifier: 'labelIdentifier', id: props.node.contextPath, hasChildren: props.node.children.length > 0, nodeDndType: undefined, isLastChild: true, isCollapsed: isCollapsed, isActive: ((_a = props.selected) === null || _a === void 0 ? void 0 : _a.contextPath.toString()) === props.node.contextPath.toString(), isFocused: ((_b = props.selected) === null || _b === void 0 ? void 0 : _b.contextPath.toString()) === props.node.contextPath.toString(), isLoading: isLoading, isDirty: false, isHidden: props.node.properties._hidden, isHiddenInIndex: props.node.properties._hiddenInIndex, isDragging: false, hasError: false, label: props.node.label, icon: (_c = nodeType === null || nodeType === void 0 ? void 0 : nodeType.ui) === null || _c === void 0 ? void 0 : _c.icon, customIconComponent: undefined, iconLabel: nodeType === null || nodeType === void 0 ? void 0 : nodeType.label, level: props.level, onToggle: handleNodeToggle, onClick: handleNodeClick, dragAndDropContext: undefined, dragForbidden: true, title: props.node.label }),
        isCollapsed ? null : props.node.children
            .map(function (child) { return props.tree.nodesByContextPath[child.contextPath.toString()]; })
            .filter(function (n) { return n; })
            .map(function (node) { return (React.createElement(NodeAdapter, __assign({}, props, { node: node, level: props.level + 1 }))); })));
};
var NodeTypeFilter = function (props) {
    var _a;
    var baseNodeTypeName = useBaseNodeTypeName();
    var selectableNodeTypes = archaeopteryx_neos_bridge_1.useNodeTypes(baseNodeTypeName);
    var handleChange = React.useCallback(function (ev) {
        var nodeType = selectableNodeTypes === null || selectableNodeTypes === void 0 ? void 0 : selectableNodeTypes.find(function (nodeType) { return nodeType.name === ev.target.value; });
        props.onSelect(nodeType !== null && nodeType !== void 0 ? nodeType : null);
    }, [selectableNodeTypes, props.onSelect]);
    return (React.createElement("select", { value: (_a = props.value) !== null && _a !== void 0 ? _a : '', onChange: handleChange },
        React.createElement("option", { value: "" }, "- None -"),
        selectableNodeTypes.map(function (nodeType) { return (React.createElement("option", { value: nodeType.name }, nodeType.label)); })));
};
//# sourceMappingURL=NodeTreeAdapter.js.map