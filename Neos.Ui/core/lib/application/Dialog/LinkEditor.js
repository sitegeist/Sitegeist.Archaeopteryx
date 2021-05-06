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
exports.LinkEditor = void 0;
var React = __importStar(require("react"));
var domain_1 = require("../../domain");
function useLastNonNull(value) {
    var valueRef = React.useRef(value);
    if (value !== null) {
        valueRef.current = value;
    }
    return valueRef.current;
}
var LinkEditor = function (props) {
    var _a, _b;
    var _c = props.linkType.useResolvedProps((_a = props.link) !== null && _a !== void 0 ? _a : undefined), busy = _c.busy, error = _c.error, result = _c.result;
    var editorProps = useLastNonNull(result);
    var _d = props.linkType, Editor = _d.getEditor, LoadingEditor = _d.getLoadingEditor;
    if (error) {
        throw error;
    }
    else if (busy && !editorProps) {
        return (React.createElement(LoadingEditor, { link: (_b = props.link) !== null && _b !== void 0 ? _b : undefined }));
    }
    else {
        return (React.createElement(domain_1.FieldGroup, { prefix: "linkTypeProps." + props.linkType.id.split('.').join('_') },
            React.createElement(Editor, __assign({}, editorProps))));
    }
};
exports.LinkEditor = LinkEditor;
//# sourceMappingURL=LinkEditor.js.map