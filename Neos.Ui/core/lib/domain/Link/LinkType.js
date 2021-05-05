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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
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
exports.useLinkTypeForHref = exports.useLinkTypes = exports.LinkType = void 0;
var React = __importStar(require("react"));
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var LinkType = (function () {
    function LinkType() {
        var _this = this;
        this.error = function (message) {
            return new Error("[" + _this.id + "]: " + message);
        };
    }
    return LinkType;
}());
exports.LinkType = LinkType;
function useLinkTypes() {
    var _a, _b;
    var globalRegistry = archaeopteryx_neos_bridge_1.useGlobalRegistry();
    return (_b = (_a = globalRegistry.get('@sitegeist/archaeopteryx/link-types')) === null || _a === void 0 ? void 0 : _a.getAllAsList()) !== null && _b !== void 0 ? _b : [];
}
exports.useLinkTypes = useLinkTypes;
function useLinkTypeForHref(href) {
    var linkTypes = useLinkTypes();
    var result = React.useMemo(function () {
        var e_1, _a;
        if (href === null) {
            return null;
        }
        try {
            for (var _b = __values(__spreadArray([], __read(linkTypes)).reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var linkType = _c.value;
                if (linkType.isSuitableFor({ href: href })) {
                    return linkType;
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
        return null;
    }, [linkTypes, href]);
    return result;
}
exports.useLinkTypeForHref = useLinkTypeForHref;
//# sourceMappingURL=LinkType.js.map