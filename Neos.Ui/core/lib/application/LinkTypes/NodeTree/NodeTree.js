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
exports.NodeTree = void 0;
var React = __importStar(require("react"));
var neos_ui_backend_connector_1 = __importDefault(require("@neos-project/neos-ui-backend-connector"));
var acl_1 = require("../../../acl");
var domain_1 = require("../../../domain");
var NodeTreeAdapter_1 = require("./NodeTreeAdapter");
function useResolvedValue() {
    var _this = this;
    var neos = acl_1.useNeos();
    var value = domain_1.useEditorValue().value;
    var _a = __read(React.useState(false), 2), loading = _a[0], setLoading = _a[1];
    var _b = __read(React.useState(null), 2), error = _b[0], setError = _b[1];
    var _c = __read(React.useState(null), 2), resolvedValue = _c[0], setResolvedValue = _c[1];
    React.useEffect(function () {
        var _a, _b, _c;
        if (value) {
            var match = /node:\/\/(.*)/.exec(value);
            if (match) {
                var siteNode_1 = (_c = (_b = (_a = neos === null || neos === void 0 ? void 0 : neos.store.getState()) === null || _a === void 0 ? void 0 : _a.cr) === null || _b === void 0 ? void 0 : _b.nodes) === null || _c === void 0 ? void 0 : _c.siteNode;
                var q_1 = neos_ui_backend_connector_1["default"].get().q;
                var identifier_1 = match[1];
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var result, result_1, result_1_1, node, err_1;
                    var e_1, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                setLoading(true);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4, q_1(siteNode_1).find("#" + identifier_1).getForTree()];
                            case 2:
                                result = _b.sent();
                                try {
                                    for (result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                                        node = result_1_1.value;
                                        setResolvedValue(node);
                                        setLoading(false);
                                        break;
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (result_1_1 && !result_1_1.done && (_a = result_1["return"])) _a.call(result_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                                return [3, 4];
                            case 3:
                                err_1 = _b.sent();
                                setError(err_1);
                                setLoading(false);
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                }); })();
            }
        }
    }, [value]);
    return {
        loading: loading,
        error: error,
        resolvedValue: resolvedValue
    };
}
exports.NodeTree = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:NodeTree';
        _this.isSuitableFor = function (props) {
            var _a;
            return Boolean((_a = props.link) === null || _a === void 0 ? void 0 : _a.uri.startsWith('node://'));
        };
        _this.getIcon = function () { return (React.createElement("div", null, "NODE TREE")); };
        _this.getTitle = function () { return 'Node Tree'; };
        _this.getPreview = function () { return (React.createElement("div", null, "NODE TREE PREVIEW")); };
        _this.getEditor = function () {
            var _a = useResolvedValue(), loading = _a.loading, error = _a.error, resolvedValue = _a.resolvedValue;
            var update = domain_1.useEditorTransactions().update;
            if (loading) {
                return (React.createElement("div", null, "Loading..."));
            }
            else if (error) {
                console.warn('[Sitegeist.Archaeopteryx]: Could not load node tree, because:');
                console.error(error);
                return (React.createElement("div", null, "An error occurred :("));
            }
            else {
                return (React.createElement(NodeTreeAdapter_1.NodeTreeAdapter, { selected: resolvedValue, onSelect: function (node) { return update("node://" + node.identifier); } }));
            }
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=NodeTree.js.map