"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.NodeTreeAdapter = void 0;
var React = __importStar(require("react"));
var immer_1 = require("immer");
var react_ui_components_1 = require("@neos-project/react-ui-components");
var neos_ui_backend_connector_1 = __importDefault(require("@neos-project/neos-ui-backend-connector"));
var acl_1 = require("../../../acl");
function adoptStartingPoint(startingPoint, referenceNode) {
    var _a = __read((startingPoint !== null && startingPoint !== void 0 ? startingPoint : '').split('@'), 1), startingPointPath = _a[0];
    var _b = __read((referenceNode !== null && referenceNode !== void 0 ? referenceNode : '').split('@'), 2), referenceNodePath = _b[0], referenceNodeContext = _b[1];
    if (startingPointPath && referenceNodePath && referenceNodeContext) {
        return startingPointPath + "@" + referenceNodeContext;
    }
    else if (referenceNodePath && referenceNodeContext) {
        return referenceNodePath + "@" + referenceNodeContext;
    }
    else {
        return null;
    }
}
function useOperation() {
    var ids = React.useRef(0);
    var _a = __read(React.useState(false), 2), loading = _a[0], setLoading = _a[1];
    var _b = __read(React.useState(null), 2), error = _b[0], setError = _b[1];
    function start() {
        var id = ids.current++;
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
function useTree(startingPoint) {
    var _this = this;
    var neos = acl_1.useNeos();
    var initialization = useOperation();
    var _a = __read(React.useState({
        nodesByContextPath: {},
        rootNodeContextPath: null,
        open: [],
        loading: []
    }), 2), treeState = _a[0], setTreeState = _a[1];
    var toggle = React.useCallback(function (contextPath) { return __awaiter(_this, void 0, void 0, function () {
        var node, q, children, nodes_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!treeState.open.includes(contextPath)) return [3, 1];
                    setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
                        var e_1, _a;
                        try {
                            for (var _b = __values(treeState.open.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var _d = __read(_c.value, 2), index = _d[0], c = _d[1];
                                if (c === contextPath) {
                                    draft.open.slice(index, 1);
                                    break;
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }); });
                    return [3, 4];
                case 1:
                    node = treeState.nodesByContextPath[contextPath];
                    if (!node) return [3, 4];
                    if (!node.children.every(function (c) { return Boolean(treeState.nodesByContextPath[c.contextPath]); })) return [3, 2];
                    setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
                        draft.open.push(contextPath);
                    }); });
                    return [3, 4];
                case 2:
                    q = neos_ui_backend_connector_1["default"].get().q;
                    children = node.children
                        .filter(function (c) { return !Boolean(treeState.nodesByContextPath[c.contextPath]); })
                        .map(function (c) { return c.contextPath; });
                    return [4, q(children).getForTree()];
                case 3:
                    nodes_1 = _a.sent();
                    setTreeState(function (treeState) { return immer_1.produce(treeState, function (draft) {
                        var e_2, _a;
                        try {
                            for (var nodes_2 = __values(nodes_1), nodes_2_1 = nodes_2.next(); !nodes_2_1.done; nodes_2_1 = nodes_2.next()) {
                                var node_1 = nodes_2_1.value;
                                draft.nodesByContextPath[node_1.contextPath] = node_1;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (nodes_2_1 && !nodes_2_1.done && (_a = nodes_2["return"])) _a.call(nodes_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        draft.open.push(contextPath);
                    }); });
                    _a.label = 4;
                case 4: return [2];
            }
        });
    }); }, [treeState]);
    React.useEffect(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var siteNode, root, q, documentNode, nodes_3, err_1;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        siteNode = (_c = (_b = (_a = neos === null || neos === void 0 ? void 0 : neos.store.getState()) === null || _a === void 0 ? void 0 : _a.cr) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.siteNode;
                        root = adoptStartingPoint(startingPoint, siteNode);
                        if (!root) return [3, 4];
                        q = neos_ui_backend_connector_1["default"].get().q;
                        documentNode = (_f = (_e = (_d = neos === null || neos === void 0 ? void 0 : neos.store.getState()) === null || _d === void 0 ? void 0 : _d.cr) === null || _e === void 0 ? void 0 : _e.nodes) === null || _f === void 0 ? void 0 : _f.documentNode;
                        initialization.start();
                        _q.label = 1;
                    case 1:
                        _q.trys.push([1, 3, , 4]);
                        return [4, q([root, documentNode]).neosUiDefaultNodes((_l = (_k = (_j = (_h = (_g = neos === null || neos === void 0 ? void 0 : neos.configuration) === null || _g === void 0 ? void 0 : _g.nodeTree) === null || _h === void 0 ? void 0 : _h.presets) === null || _j === void 0 ? void 0 : _j["default"]) === null || _k === void 0 ? void 0 : _k.baseNodeType) !== null && _l !== void 0 ? _l : 'Neos.Neos:Document', (_p = (_o = (_m = neos === null || neos === void 0 ? void 0 : neos.configuration) === null || _m === void 0 ? void 0 : _m.nodeTree) === null || _o === void 0 ? void 0 : _o.loadingDepth) !== null && _p !== void 0 ? _p : 4, [], []).getForTree()];
                    case 2:
                        nodes_3 = _q.sent();
                        setTreeState(immer_1.produce(treeState, function (draft) {
                            var e_3, _a;
                            try {
                                for (var nodes_4 = __values(nodes_3), nodes_4_1 = nodes_4.next(); !nodes_4_1.done; nodes_4_1 = nodes_4.next()) {
                                    var node = nodes_4_1.value;
                                    draft.nodesByContextPath[node.contextPath] = node;
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (nodes_4_1 && !nodes_4_1.done && (_a = nodes_4["return"])) _a.call(nodes_4);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            draft.rootNodeContextPath = root;
                        }));
                        initialization.succeed();
                        return [3, 4];
                    case 3:
                        err_1 = _q.sent();
                        initialization.fail(err_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        }); })();
    }, [neos]);
    return {
        treeState: treeState,
        toggle: toggle,
        loading: initialization.loading,
        error: initialization.error
    };
}
var NodeTreeAdapter = function () {
    var _a;
    var _b = useTree(), loading = _b.loading, error = _b.error, treeState = _b.treeState, toggle = _b.toggle;
    var handleToggle = React.useCallback(function (node) {
        toggle(node.contextPath);
    }, [toggle]);
    var handleClick = React.useCallback(function (node) {
        toggle(node.contextPath);
    }, [toggle]);
    if (loading) {
        return (React.createElement("div", null, "Loading..."));
    }
    else if (error) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
        console.error(error);
        return (React.createElement("div", null, "An error occurred :("));
    }
    else {
        var rootNode = treeState.nodesByContextPath[(_a = treeState.rootNodeContextPath) !== null && _a !== void 0 ? _a : ''];
        if (rootNode) {
            return (React.createElement(react_ui_components_1.Tree, null,
                React.createElement(NodeAdapter, { node: rootNode, tree: treeState, onToggle: handleToggle, onClick: handleClick })));
        }
        else {
            return null;
        }
    }
};
exports.NodeTreeAdapter = NodeTreeAdapter;
function useNodeType(nodeTypeName) {
    var _a;
    var neos = acl_1.useNeos();
    var nodeTypesRegistry = neos === null || neos === void 0 ? void 0 : neos.globalRegistry.get('@neos-project/neos-ui-contentrepository');
    return (_a = nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.get(nodeTypeName)) !== null && _a !== void 0 ? _a : null;
}
var NodeAdapter = function (props) {
    var _a;
    var nodeType = useNodeType(props.node.nodeType);
    console.log('nodeType', nodeType);
    var handleNodeToggle = React.useCallback(function () {
        props.onToggle(props.node);
    }, [props.node]);
    var handleNodeClick = React.useCallback(function () {
        props.onClick(props.node);
    }, [props.node]);
    return (React.createElement(react_ui_components_1.Tree.Node, null,
        React.createElement(react_ui_components_1.Tree.Node.Header, { labelIdentifier: 'labelIdentifier', id: props.node.contextPath, hasChildren: props.node.children.length > 0, nodeDndType: undefined, isLastChild: true, isCollapsed: !props.tree.open.includes(props.node.contextPath), isActive: false, isFocused: false, isLoading: false, isDirty: false, isHidden: "$get('properties._hidden', node)", isHiddenInIndex: "$get('properties._hiddenInIndex', node) || this.isIntermediate()", isDragging: false, hasError: false, label: props.node.label, icon: (_a = nodeType === null || nodeType === void 0 ? void 0 : nodeType.ui) === null || _a === void 0 ? void 0 : _a.icon, customIconComponent: undefined, iconLabel: 'this.getNodeTypeLabel()', level: 1, onToggle: handleNodeToggle, onClick: handleNodeClick, dragAndDropContext: undefined, dragForbidden: true, title: props.node.label })));
};
//# sourceMappingURL=NodeTreeAdapter.js.map