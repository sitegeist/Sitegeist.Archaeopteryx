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
exports.Dialog = void 0;
var React = __importStar(require("react"));
var react_ui_components_1 = require("@neos-project/react-ui-components");
var react_final_form_1 = require("react-final-form");
var domain_1 = require("../../domain");
var LinkEditor_1 = require("./LinkEditor");
var Settings_1 = require("./Settings");
var Dialog = function () {
    var linkTypes = domain_1.useLinkTypes();
    var _a = domain_1.useEditorTransactions(), dismiss = _a.dismiss, apply = _a.apply;
    var _b = domain_1.useEditorState(), isOpen = _b.isOpen, value = _b.value;
    var handleSubmit = React.useCallback(function (values) {
        var _a;
        var linkType = linkTypes.find(function (linkType) { return linkType.id === values.linkTypeId; });
        if (linkType) {
            var props = (_a = values.linkTypeProps) === null || _a === void 0 ? void 0 : _a[linkType.id.split('.').join('_')];
            if (props) {
                var link = linkType.convertPropsToLink(props);
                apply(link);
            }
        }
    }, [linkTypes]);
    return (React.createElement(react_ui_components_1.Dialog, { title: "Sitegeist.Archaeopteryx", isOpen: isOpen, style: "jumbo", onRequestClose: function () { } },
        React.createElement(react_final_form_1.Form, { onSubmit: handleSubmit }, function (_a) {
            var handleSubmit = _a.handleSubmit, valid = _a.valid;
            return (React.createElement("form", { onSubmit: handleSubmit },
                value.transient === null ? (React.createElement(DialogWithEmptyValue, null)) : (React.createElement(DialogWithValue, { value: value.transient })),
                React.createElement(react_ui_components_1.Button, { onClick: dismiss }, "Cancel"),
                React.createElement(react_ui_components_1.Button, { style: "success", type: "submit", disabled: !valid }, "Apply")));
        })));
};
exports.Dialog = Dialog;
var DialogWithEmptyValue = function () {
    var linkTypes = domain_1.useLinkTypes();
    return (React.createElement(domain_1.Field, { name: "linkTypeId", initialValue: linkTypes[0].id }, function (_a) {
        var input = _a.input;
        return (React.createElement("div", null,
            linkTypes.map(function (linkType) { return (React.createElement(react_ui_components_1.Button, { isActive: linkType.id === input.value, key: linkType.id, onClick: function () { return input.onChange(linkType.id); } },
                React.createElement(linkType.getStaticIcon, null))); }),
            React.createElement("div", null,
                React.createElement(LinkEditor_1.LinkEditor, { key: input.value, link: null, linkType: linkTypes.find(function (linkType) { return linkType.id === input.value; }) }))));
    }));
};
var DialogWithValue = function (props) {
    var form = react_final_form_1.useForm();
    var unset = domain_1.useEditorTransactions().unset;
    var linkType = domain_1.useLinkTypeForHref(props.value.href);
    var _a = __read(React.useState(false), 2), showSettings = _a[0], setShowSettings = _a[1];
    return (React.createElement(domain_1.Field, { name: "linkTypeId", initialValue: linkType.id }, function () { return (React.createElement("div", null,
        React.createElement(react_ui_components_1.Button, { isActive: !showSettings, onClick: function () { return setShowSettings(false); } },
            React.createElement(linkType.getIcon, null)),
        React.createElement(react_ui_components_1.Button, { isActive: showSettings, onClick: function () { return setShowSettings(true); } }, "SETTINGS"),
        React.createElement("div", null,
            React.createElement(react_ui_components_1.Button, { onClick: function () {
                    unset();
                    form.change('linkTypeProps', null);
                } }, "Delete")),
        React.createElement("div", null,
            React.createElement("div", { hidden: !showSettings },
                React.createElement(Settings_1.Settings, { initialValue: props.value.options })),
            React.createElement("div", { hidden: showSettings },
                React.createElement(LinkEditor_1.LinkEditor, { key: linkType.id, link: props.value, linkType: linkType }))))); }));
};
//# sourceMappingURL=Dialog.js.map