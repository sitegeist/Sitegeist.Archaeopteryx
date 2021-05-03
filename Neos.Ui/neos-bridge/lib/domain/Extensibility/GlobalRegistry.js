"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalRegistry = void 0;
var NeosContext_1 = require("./NeosContext");
function useGlobalRegistry() {
    var _a;
    var neos = NeosContext_1.useNeos();
    return (_a = neos === null || neos === void 0 ? void 0 : neos.globalRegistry) !== null && _a !== void 0 ? _a : null;
}
exports.useGlobalRegistry = useGlobalRegistry;
//# sourceMappingURL=GlobalRegistry.js.map