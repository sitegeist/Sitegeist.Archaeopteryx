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
    var isOpen = domain_1.useEditorState().isOpen;
    var dismiss = domain_1.useEditorTransaction().dismiss;
    return (React.createElement(react_ui_components_1.Dialog, { title: "Sitegeist.Archaeopteryx", isOpen: isOpen },
        "Hello World!",
        React.createElement(react_ui_components_1.Button, { onClick: dismiss }, "Click here!")));
};
exports.Modal = Modal;
//# sourceMappingURL=Modal.js.map