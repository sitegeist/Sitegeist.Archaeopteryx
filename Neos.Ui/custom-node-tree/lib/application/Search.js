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
exports.Search = void 0;
var React = __importStar(require("react"));
var react_use_1 = require("react-use");
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var domain_1 = require("../domain");
var presentation_1 = require("../presentation");
var Search = function (props) {
    var componentWasInitializedRef = React.useRef(false);
    var valueWasClearedRef = React.useRef(false);
    var nodeTypesRegistry = archaeopteryx_neos_bridge_1.useNodeTypesRegistry();
    var _a = __read(React.useState(props.initialValue), 2), value = _a[0], setValue = _a[1];
    var handleClear = React.useCallback(function () {
        setValue('');
        if (nodeTypesRegistry) {
            domain_1.searchForNodesInNodeTree({ state: props.state, dispatch: props.dispatch }, nodeTypesRegistry, null);
        }
        valueWasClearedRef.current = true;
    }, [setValue, nodeTypesRegistry]);
    react_use_1.useDebounce(function () {
        if (componentWasInitializedRef.current && !valueWasClearedRef.current) {
            if (nodeTypesRegistry) {
                domain_1.searchForNodesInNodeTree({ state: props.state, dispatch: props.dispatch }, nodeTypesRegistry, value || null);
            }
        }
        else {
            componentWasInitializedRef.current = true;
            valueWasClearedRef.current = false;
        }
    }, 300, [value, nodeTypesRegistry]);
    return (React.createElement(presentation_1.SearchInput, { value: value, onChange: setValue, onClear: handleClear }));
};
exports.Search = Search;
//# sourceMappingURL=Search.js.map