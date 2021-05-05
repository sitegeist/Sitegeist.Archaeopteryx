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
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeTreeReducer = exports.initialNodeTreeState = void 0;
var immer_1 = __importDefault(require("immer"));
var typesafe_actions_1 = require("typesafe-actions");
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var actions = __importStar(require("./NodeTreeAction"));
exports.initialNodeTreeState = {
    rootNode: null,
    baseNodeTypeName: archaeopteryx_neos_bridge_1.NodeTypeName('Neos.Neos:Document'),
    filterParams: {
        searchTerm: null,
        nodeTypeFilter: null
    },
    nodesByContextPath: {
        all: {},
        filtered: null
    },
    nodesByState: {
        uncollapsed: [],
        loading: []
    }
};
function nodeTreeReducer(state, action) {
    if (state === void 0) { state = exports.initialNodeTreeState; }
    switch (action.type) {
        case typesafe_actions_1.getType(actions.NodesWereLoaded): return immer_1.default(state, function (draft) {
            var e_1, _a;
            draft.rootNode = action.payload.rootNode;
            draft.baseNodeTypeName = action.payload.baseNodeTypeName;
            draft.nodesByContextPath.filtered = null;
            draft.nodesByState.loading = state.nodesByState.loading.filter(function (node) { return node !== state.rootNode; });
            draft.nodesByState.uncollapsed = action.payload.uncollapsedNodes;
            try {
                for (var _b = __values(action.payload.nodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    draft.nodesByContextPath.all[node.contextPath.toString()] = node;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        case typesafe_actions_1.getType(actions.ChildNodesWereRequested): return immer_1.default(state, function (draft) {
            draft.nodesByState.loading.push(action.payload);
        });
        case typesafe_actions_1.getType(actions.ChildNodesWereLoaded): return immer_1.default(state, function (draft) {
            var e_2, _a;
            draft.nodesByState.loading = state.nodesByState.loading.filter(function (node) { return node !== action.payload.parentNode; });
            try {
                for (var _b = __values(action.payload.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    draft.nodesByContextPath.all[node.contextPath.toString()] = node;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
        case typesafe_actions_1.getType(actions.NodeWasToggled): return immer_1.default(state, function (draft) {
            var isUncollapsed = action.payload.forceToggleState === undefined
                ? state.nodesByState.uncollapsed.includes(action.payload.node)
                : !action.payload.forceToggleState;
            if (isUncollapsed) {
                draft.nodesByState.uncollapsed = state.nodesByState.uncollapsed.filter(function (node) { return node !== action.payload.node; });
            }
            else {
                draft.nodesByState.uncollapsed.push(action.payload.node);
            }
        });
        case typesafe_actions_1.getType(actions.FilteredNodesWereRequested): return immer_1.default(state, function (draft) {
            if (state.rootNode && !state.nodesByState.loading.includes(state.rootNode)) {
                draft.nodesByState.loading.push(state.rootNode);
            }
            draft.filterParams = action.payload;
            draft.nodesByContextPath.filtered = {};
        });
        case typesafe_actions_1.getType(actions.FilteredNodesWereLoaded): return immer_1.default(state, function (draft) {
            var e_3, _a;
            draft.nodesByState.loading = state.nodesByState.loading.filter(function (node) { return node !== state.rootNode; });
            draft.nodesByContextPath.filtered = {};
            try {
                for (var _b = __values(action.payload), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    draft.nodesByContextPath.filtered[node.contextPath.toString()] = node;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
        case typesafe_actions_1.getType(actions.FilteredNodesWereReset): return immer_1.default(state, function (draft) {
            draft.nodesByState.loading = state.nodesByState.loading.filter(function (node) { return node !== state.rootNode; });
            draft.nodesByContextPath.filtered = null;
        });
        default:
            return state;
    }
}
exports.nodeTreeReducer = nodeTreeReducer;
//# sourceMappingURL=NodeTreeState.js.map