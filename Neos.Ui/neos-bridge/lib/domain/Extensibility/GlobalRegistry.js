"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalRegistry = void 0;
var NeosContext_1 = require("./NeosContext");
function useGlobalRegistry() {
    var neos = NeosContext_1.useNeos();
    return neos.globalRegistry;
}
exports.useGlobalRegistry = useGlobalRegistry;
//# sourceMappingURL=GlobalRegistry.js.map