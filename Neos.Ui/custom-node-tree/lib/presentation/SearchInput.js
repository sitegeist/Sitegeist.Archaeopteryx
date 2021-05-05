"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInput = void 0;
var React = __importStar(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var react_ui_components_1 = require("@neos-project/react-ui-components");
var SearchIcon = styled_components_1.default(react_ui_components_1.Icon)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    position: absolute;\n    top: 50%;\n    left: 21px;\n    transform: translate(-50%, -50%);\n"], ["\n    position: absolute;\n    top: 50%;\n    left: 21px;\n    transform: translate(-50%, -50%);\n"])));
var ClearIcon = styled_components_1.default(react_ui_components_1.IconButton)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    position: absolute;\n    top: 0;\n    right: 0;\n    color: #000;\n"], ["\n    position: absolute;\n    top: 0;\n    right: 0;\n    color: #000;\n"])));
var StyledTextInput = styled_components_1.default(react_ui_components_1.TextInput)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    padding-left: 42px;\n\n    &:focus {\n        background: #3f3f3f;\n        color: #fff;\n    }\n"], ["\n    padding-left: 42px;\n\n    &:focus {\n        background: #3f3f3f;\n        color: #fff;\n    }\n"])));
var SearchInputContainer = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    position: relative;\n"], ["\n    position: relative;\n"])));
var SearchInput = function (props) {
    return (React.createElement(SearchInputContainer, null,
        React.createElement(SearchIcon, { icon: "search" }),
        React.createElement(StyledTextInput, { type: "search", value: props.value, placeholder: 'Search', onChange: props.onChange }),
        props.value && (React.createElement(ClearIcon, { icon: "times", onClick: props.onClear }))));
};
exports.SearchInput = SearchInput;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=SearchInput.js.map