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
exports.Modal = void 0;
var React = __importStar(require("react"));
var react_ui_components_1 = require("@neos-project/react-ui-components");
var domain_1 = require("../../domain");
var Modal = function () {
    var _a = domain_1.useEditorState(), isOpen = _a.isOpen, value = _a.value;
    var _b = domain_1.useEditorTransaction(), dismiss = _b.dismiss, apply = _b.apply;
    var linkTypes = domain_1.useLinkTypes();
    var _c = React.useState(linkTypes[0]), activeLinkType = _c[0], setActiveLinkType = _c[1];
    var Editor = activeLinkType.getEditor;
    return (React.createElement(react_ui_components_1.Dialog, { title: "Sitegeist.Archaeopteryx", isOpen: isOpen, onRequestClose: dismiss },
        linkTypes.map(function (linkType) {
            var Icon = linkType.getIcon, id = linkType.id;
            return (React.createElement(react_ui_components_1.Button, { isActive: linkType.id === activeLinkType.id, key: id, onClick: function () { return setActiveLinkType(linkType); } },
                React.createElement(Icon, null)));
        }),
        React.createElement("div", null,
            React.createElement(Editor, null)),
        React.createElement(react_ui_components_1.Button, { onClick: dismiss }, "Click here!"),
        React.createElement(react_ui_components_1.Button, { onClick: function () { return apply(value.transient); } }, "Apply")));
};
exports.Modal = Modal;
//# sourceMappingURL=Modal.js.map