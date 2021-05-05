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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTree = void 0;
var React = __importStar(require("react"));
var react_use_1 = require("react-use");
var react_ui_components_1 = require("@neos-project/react-ui-components");
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var domain_1 = require("../domain");
var NodeTreeNode_1 = require("./NodeTreeNode");
var Search_1 = require("./Search");
var NodeTypeFilter_1 = require("./NodeTypeFilter");
var NodeTree = function (props) {
    var _a, _b;
    var nodeTypesRegistry = archaeopteryx_neos_bridge_1.useNodeTypesRegistry();
    var _c = __read(React.useReducer(domain_1.nodeTreeReducer, domain_1.initialNodeTreeState), 2), state = _c[0], dispatch = _c[1];
    var initialize = react_use_1.useAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, domain_1.loadNodeTree({ state: state, dispatch: dispatch }, nodeTypesRegistry, props.configuration)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); }, [
        props.configuration.baseNodeTypeName,
        props.configuration.rootNodeContextPath
    ]);
    var selectedNode = React.useMemo(function () { return props.configuration.selectedNodeContextPath
        ? domain_1.findNodeByContextPath(state, props.configuration.selectedNodeContextPath)
        : null; }, [props.configuration, state.nodesByContextPath]);
    var handleToggle = React.useCallback(function (node) {
        if (nodeTypesRegistry) {
            domain_1.toggleNodeInNodeTree({ state: state, dispatch: dispatch }, nodeTypesRegistry, node);
        }
    }, [state.nodesByContextPath, state.nodesByState.uncollapsed, nodeTypesRegistry, dispatch]);
    var handleClick = function (node) { return props.onSelect(node); };
    var main;
    if (initialize.error) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
        console.error(initialize.error);
        main = (React.createElement("div", null, "An error occurred :("));
    }
    else if (initialize.loading || !state.rootNode) {
        main = (React.createElement("div", null, "Loading..."));
    }
    else {
        main = (React.createElement(react_ui_components_1.Tree, null,
            React.createElement(NodeTreeNode_1.NodeTreeNode, { state: state, dispatch: dispatch, node: state.rootNode, selectedNode: selectedNode, level: 1, onToggle: handleToggle, onClick: handleClick })));
    }
    var search = null;
    if ((_a = props.options) === null || _a === void 0 ? void 0 : _a.enableSearch) {
        search = (React.createElement(Search_1.Search, { state: state, dispatch: dispatch, initialValue: "" }));
    }
    var nodeTypeFilter = null;
    if ((_b = props.options) === null || _b === void 0 ? void 0 : _b.enableNodeTypeFilter) {
        nodeTypeFilter = (React.createElement(NodeTypeFilter_1.NodeTypeFilter, { state: state, dispatch: dispatch, initialValue: "" }));
    }
    return (React.createElement("div", { style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)'
        } },
        search ? (React.createElement("div", { style: {
                gridColumn: nodeTypeFilter
                    ? '1 / span 1'
                    : '1 / span 2'
            } }, search)) : null,
        nodeTypeFilter ? (React.createElement("div", { style: {
                gridColumn: search
                    ? '2 / span 1'
                    : '1 / span 2'
            } }, nodeTypeFilter)) : null,
        main ? (React.createElement("div", { style: {
                gridColumn: '1 / span 2',
                height: '50vh',
                maxHeight: '300px',
                overflowY: 'auto'
            } }, main)) : null));
};
exports.NodeTree = NodeTree;
//# sourceMappingURL=NodeTree.js.map