"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Node = void 0;
var React = __importStar(require("react"));
var react_use_1 = require("react-use");
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var archaeopteryx_custom_node_tree_1 = require("@sitegeist/archaeopteryx-custom-node-tree");
var domain_1 = require("../../../domain");
var propsCache = new Map();
exports.Node = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:Node';
        _this.isSuitableFor = function (link) {
            return link.href.startsWith('node://');
        };
        _this.useResolvedProps = function (link) {
            var siteNodeContextPath = archaeopteryx_neos_bridge_1.useSiteNodeContextPath();
            var asyncState = react_use_1.useAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                var match, identifier, cacheIdentifier, result, result_1, result_1_1, node, props;
                var e_1, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('resolveNodeLink', link);
                            if (link === undefined) {
                                return [2, { node: null }];
                            }
                            if (!siteNodeContextPath) {
                                throw this.error('Could not find siteNodeContextPath.');
                            }
                            match = /node:\/\/(.*)/.exec(link.href);
                            if (!match) {
                                throw this.error("Cannot handle href \"" + link.href + "\".");
                            }
                            identifier = match[1];
                            cacheIdentifier = identifier + "@" + siteNodeContextPath.context;
                            if (propsCache.has(cacheIdentifier)) {
                                return [2, propsCache.get(cacheIdentifier)];
                            }
                            return [4, archaeopteryx_neos_bridge_1.q(siteNodeContextPath).find("#" + identifier)
                                    .getForTree()];
                        case 1:
                            result = _b.sent();
                            try {
                                for (result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                                    node = result_1_1.value;
                                    props = { node: node };
                                    propsCache.set(cacheIdentifier, props);
                                    return [2, props];
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            throw this.error("Could not find node for identifier \"" + identifier + "\".");
                    }
                });
            }); }, [siteNodeContextPath]);
            return domain_1.Process.fromAsyncState(asyncState);
        };
        _this.getStaticIcon = function () { return (React.createElement("div", null, "NODE TREE")); };
        _this.getIcon = function () { return (React.createElement("div", null, "NODE TREE")); };
        _this.getStaticTitle = function () { return 'Node Tree'; };
        _this.getTitle = function () { return 'Node Tree'; };
        _this.getLoadingPreview = function () { return (React.createElement("div", null, "NODE TREE PREVIEW")); };
        _this.getPreview = function () { return (React.createElement("div", null, "NODE TREE PREVIEW")); };
        _this.getLoadingEditor = function () { return (React.createElement("div", null, "NODE TREE EDITOR")); };
        _this.getEditor = function (props) {
            var _a, _b, _c, _d;
            var update = domain_1.useEditorTransactions().update;
            var siteNodeContextPath = archaeopteryx_neos_bridge_1.useSiteNodeContextPath();
            var documentNodeContextPath = archaeopteryx_neos_bridge_1.useDocumentNodeContextPath();
            var baseNodeTypeName = (_a = archaeopteryx_neos_bridge_1.useConfiguration(function (c) { var _a, _b, _c; return (_c = (_b = (_a = c.nodeTree) === null || _a === void 0 ? void 0 : _a.presets) === null || _b === void 0 ? void 0 : _b.default) === null || _c === void 0 ? void 0 : _c.baseNodeType; })) !== null && _a !== void 0 ? _a : archaeopteryx_neos_bridge_1.NodeTypeName('Neos.Neos:Document');
            var loadingDepth = (_b = archaeopteryx_neos_bridge_1.useConfiguration(function (c) { var _a; return (_a = c.nodeTree) === null || _a === void 0 ? void 0 : _a.loadingDepth; })) !== null && _b !== void 0 ? _b : 4;
            if (!siteNodeContextPath) {
                throw _this.error('Could not load node tree, because siteNodeContextPath could not be determined.');
            }
            else if (!documentNodeContextPath) {
                throw _this.error('Could not load node tree, because documentNodeContextPath could not be determined.');
            }
            else {
                console.log('props.node?.contextPath', (_c = props.node) === null || _c === void 0 ? void 0 : _c.contextPath);
                return (React.createElement(archaeopteryx_custom_node_tree_1.NodeTree, { configuration: {
                        baseNodeTypeName: baseNodeTypeName,
                        rootNodeContextPath: siteNodeContextPath,
                        documentNodeContextPath: documentNodeContextPath,
                        selectedNodeContextPath: (_d = props.node) === null || _d === void 0 ? void 0 : _d.contextPath,
                        loadingDepth: loadingDepth
                    }, options: {
                        enableSearch: true,
                        enableNodeTypeFilter: true
                    }, onSelect: function (node) {
                        var cacheIdentifier = node.identifier + "@" + siteNodeContextPath.context;
                        propsCache.set(cacheIdentifier, { node: node });
                        console.log(cacheIdentifier);
                        update({ href: "node://" + node.identifier });
                    } }));
            }
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=Node.js.map