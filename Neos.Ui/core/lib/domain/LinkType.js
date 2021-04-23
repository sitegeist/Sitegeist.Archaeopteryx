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
        for (var _i = 0, linkTypes_1 = linkTypes; _i < linkTypes_1.length; _i++) {
            var linkType = linkTypes_1[_i];
            if (linkType.isSatisfiedBy({ uri: uri })) {
                return linkType;
            }
        }
        return null;
    }, [linkTypes, uri]);
    return result;
}
exports.useLinkTypeForUri = useLinkTypeForUri;
//# sourceMappingURL=LinkType.js.map