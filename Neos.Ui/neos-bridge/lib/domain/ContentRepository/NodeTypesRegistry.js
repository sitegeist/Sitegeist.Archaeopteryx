"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodeTypesRegistry = void 0;
var Extensibility_1 = require("../Extensibility");
function useNodeTypesRegistry() {
    var globalRegistry = Extensibility_1.useGlobalRegistry();
    var nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    return nodeTypesRegistry;
}
exports.useNodeTypesRegistry = useNodeTypesRegistry;
//# sourceMappingURL=NodeTypesRegistry.js.map