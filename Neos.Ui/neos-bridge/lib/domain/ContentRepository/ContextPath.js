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
exports.useDocumentNodeContextPath = exports.useSiteNodeContextPath = exports.ContextPath = void 0;
var React = __importStar(require("react"));
var Store_1 = require("../Extensibility/Store");
var ContextPath = (function () {
    function ContextPath(path, context) {
        this.path = path;
        this.context = context;
    }
    ContextPath.fromString = function (string) {
        var _a = __read((string !== null && string !== void 0 ? string : '').split('@'), 2), path = _a[0], context = _a[1];
        if (path && string) {
            return new ContextPath(path, context);
        }
        return null;
    };
    ContextPath.prototype.adopt = function (pathLike) {
        var _a = __read((pathLike !== null && pathLike !== void 0 ? pathLike : '').split('@'), 1), path = _a[0];
        if (path) {
            return new ContextPath(path, this.context);
        }
        return null;
    };
    ContextPath.prototype.getIntermediateContextPaths = function (other) {
        var e_1, _a;
        if (other.path.startsWith(this.path)) {
            var segments = other.path.split('/');
            var result = [];
            try {
                for (var _b = __values(segments.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 1), index = _d[0];
                    var path = segments.slice(0, -index).join('/');
                    if (path) {
                        result.push(new ContextPath(path, this.context));
                    }
                    if (path === this.path) {
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
            return result;
        }
        return [];
    };
    ContextPath.prototype.equals = function (other) {
        return this.path === other.path && this.context === other.context;
    };
    ContextPath.prototype.toString = function () {
        return this.path + "@" + this.context;
    };
    Object.defineProperty(ContextPath.prototype, "depth", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.path.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    return ContextPath;
}());
exports.ContextPath = ContextPath;
function useSiteNodeContextPath() {
    var siteNodeContextPath = Store_1.useSelector(function (state) { var _a, _b; return (_b = (_a = state.cr) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.siteNode; });
    var result = React.useMemo(function () {
        if (siteNodeContextPath) {
            return ContextPath.fromString(siteNodeContextPath);
        }
        return null;
    }, [siteNodeContextPath]);
    return result;
}
exports.useSiteNodeContextPath = useSiteNodeContextPath;
function useDocumentNodeContextPath() {
    var documentNodeContextPath = Store_1.useSelector(function (state) { var _a, _b; return (_b = (_a = state.cr) === null || _a === void 0 ? void 0 : _a.nodes) === null || _b === void 0 ? void 0 : _b.documentNode; });
    var result = React.useMemo(function () {
        if (documentNodeContextPath) {
            return ContextPath.fromString(documentNodeContextPath);
        }
        return null;
    }, [documentNodeContextPath]);
    return result;
}
exports.useDocumentNodeContextPath = useDocumentNodeContextPath;
//# sourceMappingURL=ContextPath.js.map