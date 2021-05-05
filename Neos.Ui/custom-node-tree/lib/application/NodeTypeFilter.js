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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTypeFilter = void 0;
var React = __importStar(require("react"));
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var react_ui_components_1 = require("@neos-project/react-ui-components");
var domain_1 = require("../domain");
var searchOptions = function (searchTerm, processedSelectBoxOptions) {
    return processedSelectBoxOptions.filter(function (option) { return true
        && option.label
        && option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1; });
};
var NodeTypeFilter = function (props) {
    var _a;
    var presets = (_a = archaeopteryx_neos_bridge_1.useConfiguration(function (c) { var _a; return (_a = c.nodeTree) === null || _a === void 0 ? void 0 : _a.presets; })) !== null && _a !== void 0 ? _a : {};
    var nodeTypesRegistry = archaeopteryx_neos_bridge_1.useNodeTypesRegistry();
    var _b = __read(React.useState(''), 2), filterTerm = _b[0], setFilterTerm = _b[1];
    var _c = __read(React.useState(props.initialValue), 2), value = _c[0], setValue = _c[1];
    var options = React.useMemo(function () {
        var options = Object.keys(presets)
            .filter(function (presetName) { return (presetName !== 'default'); })
            .map(function (presetName) {
            var _a, _b;
            return ({
                value: presets[presetName].baseNodeType,
                label: ((_a = presets[presetName].ui) === null || _a === void 0 ? void 0 : _a.label) || '[' + presetName + ']',
                icon: (_b = presets[presetName].ui) === null || _b === void 0 ? void 0 : _b.icon
            });
        });
        if (options.length === 0 && nodeTypesRegistry) {
            var documentNodeTypes = nodeTypesRegistry
                .getSubTypesOf(nodeTypesRegistry.getRole('document'))
                .map(function (nodeTypeName) { return nodeTypesRegistry.get(nodeTypeName); })
                .filter(Boolean);
            options = documentNodeTypes.map(function (nodeType) {
                var _a;
                return ({
                    value: nodeType.name,
                    label: nodeType.label,
                    icon: (_a = nodeType.ui) === null || _a === void 0 ? void 0 : _a.icon
                });
            });
        }
        return options;
    }, [presets, nodeTypesRegistry]);
    React.useEffect(function () {
        if (nodeTypesRegistry) {
            domain_1.filterNodesByNodeTypeInNodeTree({ state: props.state, dispatch: props.dispatch }, nodeTypesRegistry, value ? archaeopteryx_neos_bridge_1.NodeTypeName(value) : null);
        }
    }, [value, nodeTypesRegistry]);
    return (React.createElement(react_ui_components_1.SelectBox, { placeholder: 'TODO: Label', placeholderIcon: 'filter', onValueChange: setValue, allowEmpty: true, value: value, options: searchOptions(filterTerm, options), displaySearchBox: true, searchTerm: filterTerm, onSearchTermChange: setFilterTerm, threshold: 0, noMatchesFoundLabel: 'Neos.Neos:Main:noMatchesFound', searchBoxLeftToTypeLabel: 'Neos.Neos:Main:searchBoxLeftToType' }));
};
exports.NodeTypeFilter = NodeTypeFilter;
//# sourceMappingURL=NodeTypeFilter.js.map