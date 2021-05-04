"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTreeNode = void 0;
var React = __importStar(require("react"));
var react_ui_components_1 = require("@neos-project/react-ui-components");
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var domain_1 = require("../domain");
var NodeTreeNode = function (props) {
    var _a;
    var nodeType = archaeopteryx_neos_bridge_1.useNodeType(props.node.nodeType);
    var handleNodeToggle = React.useMemo(function () { return function () { return props.onToggle(props.node); }; }, [props.onToggle, props.node]);
    var handleNodeClick = React.useMemo(function () { return function () { return props.onClick(props.node); }; }, [props.onToggle, props.node]);
    var isCollapsed = React.useMemo(function () { return domain_1.isNodeCollapsed(props.state, props.node); }, [props.state.nodesByState.uncollapsed, props.node]);
    var isLoading = React.useMemo(function () { return domain_1.isNodeLoading(props.state, props.node); }, [props.state.nodesByState.loading, props.node]);
    var isSelected = React.useMemo(function () { return !props.selectedNode || props.node.contextPath.equals(props.selectedNode.contextPath); }, [props.node, props.selectedNode]);
    return (React.createElement(react_ui_components_1.Tree.Node, null,
        React.createElement(react_ui_components_1.Tree.Node.Header, { labelIdentifier: 'labelIdentifier', id: props.node.contextPath, hasChildren: props.node.children.length > 0, isLastChild: true, isCollapsed: isCollapsed, isActive: isSelected, isFocused: isSelected, isLoading: isLoading, isDirty: false, isHidden: props.node.properties._hidden, isHiddenInIndex: props.node.properties._hiddenInIndex, isDragging: false, hasError: false, label: props.node.label, icon: (_a = nodeType === null || nodeType === void 0 ? void 0 : nodeType.ui) === null || _a === void 0 ? void 0 : _a.icon, iconLabel: nodeType === null || nodeType === void 0 ? void 0 : nodeType.label, level: props.level, onToggle: handleNodeToggle, onClick: handleNodeClick, dragForbidden: true, title: props.node.label }),
        isCollapsed
            ? null
            : domain_1.findChildNodesForNode(props.state, props.node).map(function (childNode) { return (React.createElement(exports.NodeTreeNode, __assign({}, props, { node: childNode, level: props.level + 1 }))); })));
};
exports.NodeTreeNode = NodeTreeNode;
//# sourceMappingURL=NodeTreeNode.js.map