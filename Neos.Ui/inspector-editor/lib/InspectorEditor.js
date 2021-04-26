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
exports.InspectorEditor = void 0;
var React = __importStar(require("react"));
var archaeopteryx_core_1 = require("@sitegeist/archaeopteryx-core");
var InspectorEditor = function (props) {
    var value = (typeof props.value === 'string' ? props.value : 'https://example.com') || 'https://example.com';
    var linkType = archaeopteryx_core_1.useLinkTypeForUri(value);
    if (linkType) {
        var Preview = linkType.getPreview;
        var link = { uri: value };
        return (React.createElement(Preview, { link: link }));
    }
    return (React.createElement("div", null,
        "No Editor for ",
        value));
};
exports.InspectorEditor = InspectorEditor;
//# sourceMappingURL=InspectorEditor.js.map