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
var react_ui_components_1 = require("@neos-project/react-ui-components");
var archaeopteryx_core_1 = require("@sitegeist/archaeopteryx-core");
var InspectorEditor = function (props) {
    var editLink = archaeopteryx_core_1.useEditorTransaction().editLink;
    var value = typeof props.value === 'string' ? props.value : '';
    var linkType = archaeopteryx_core_1.useLinkTypeForUri(value);
    if (linkType) {
        var Preview = linkType.getPreview;
        var link = { uri: value };
        return (React.createElement(Preview, { link: link }));
    }
    else if (Boolean(value) === false) {
        return (React.createElement(react_ui_components_1.Button, { onClick: function () { return editLink(null); } }, "Create Link"));
    }
    else {
        return (React.createElement("div", null,
            "No Editor for ",
            JSON.stringify(props.value)));
    }
};
exports.InspectorEditor = InspectorEditor;
//# sourceMappingURL=InspectorEditor.js.map