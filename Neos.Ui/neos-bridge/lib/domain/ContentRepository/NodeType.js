"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodeTypes = exports.useNodeType = exports.NodeTypeName = void 0;
var NodeTypesRegistry_1 = require("./NodeTypesRegistry");
function NodeTypeName(name) {
    return name;
}
exports.NodeTypeName = NodeTypeName;
function useNodeType(nodeTypeName) {
    var _a;
    var nodeTypesRegistry = NodeTypesRegistry_1.useNodeTypesRegistry();
    return (_a = nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.get(nodeTypeName)) !== null && _a !== void 0 ? _a : null;
}
exports.useNodeType = useNodeType;
function useNodeTypes(baseNodeTypeName) {
    var _a;
    var nodeTypesRegistry = NodeTypesRegistry_1.useNodeTypesRegistry();
    return (_a = nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.getSubTypesOf(baseNodeTypeName).map(function (nodeTypeName) { return nodeTypesRegistry === null || nodeTypesRegistry === void 0 ? void 0 : nodeTypesRegistry.get(nodeTypeName); }).filter(function (n) { return n; })) !== null && _a !== void 0 ? _a : [];
}
exports.useNodeTypes = useNodeTypes;
//# sourceMappingURL=NodeType.js.map