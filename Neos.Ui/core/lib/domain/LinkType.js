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
exports.__esModule = true;
exports.useLinkTypeForUri = exports.useLinkTypes = exports.LinkType = void 0;
var React = __importStar(require("react"));
var acl_1 = require("../acl");
var LinkType = (function () {
    function LinkType() {
    }
    return LinkType;
}());
exports.LinkType = LinkType;
function useLinkTypes() {
    var neosContext = acl_1.useNeos();
    if (neosContext) {
        var globalRegistry = neosContext.globalRegistry;
        var linkTypesRegistry = globalRegistry.get('@sitegeist/archaeopteryx/link-types');
        if (linkTypesRegistry) {
            return linkTypesRegistry.getAllAsList();
        }
    }
    return [];
}
exports.useLinkTypes = useLinkTypes;
function useLinkTypeForUri(uri) {
    var linkTypes = useLinkTypes();
    var result = React.useMemo(function () {
        var e_1, _a;
        try {
            for (var linkTypes_1 = __values(linkTypes), linkTypes_1_1 = linkTypes_1.next(); !linkTypes_1_1.done; linkTypes_1_1 = linkTypes_1.next()) {
                var linkType = linkTypes_1_1.value;
                if (linkType.isSuitableFor({ link: { uri: uri } })) {
                    return linkType;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (linkTypes_1_1 && !linkTypes_1_1.done && (_a = linkTypes_1["return"])) _a.call(linkTypes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    }, [linkTypes, uri]);
    return result;
}
exports.useLinkTypeForUri = useLinkTypeForUri;
//# sourceMappingURL=LinkType.js.map