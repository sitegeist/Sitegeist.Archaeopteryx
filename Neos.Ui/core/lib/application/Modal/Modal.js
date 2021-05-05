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
exports.Modal = void 0;
var React = __importStar(require("react"));
var react_ui_components_1 = require("@neos-project/react-ui-components");
var react_final_form_1 = require("react-final-form");
var domain_1 = require("../../domain");
var Modal = function () {
    var _a = domain_1.useEditorState(), isOpen = _a.isOpen, value = _a.value;
    var contents = null;
    if (isOpen) {
        if (value.transient) {
            contents = (React.createElement(DialogWithValue, { value: value.transient }));
        }
        else {
            contents = (React.createElement(DialogWithEmptyValue, null));
        }
        return (React.createElement(react_ui_components_1.Dialog, { title: "Sitegeist.Archaeopteryx", isOpen: isOpen, style: "jumbo", onRequestClose: function () { } }, contents));
    }
    return null;
};
exports.Modal = Modal;
var DialogWithEmptyValue = function () {
    var dismiss = domain_1.useEditorTransactions().dismiss;
    var linkTypes = domain_1.useLinkTypes();
    var _a = __read(React.useState(linkTypes[0]), 2), activeLinkType = _a[0], setActiveLinkType = _a[1];
    return (React.createElement(React.Fragment, null,
        linkTypes.map(function (linkType) { return (React.createElement(react_ui_components_1.Button, { key: linkType.id, onClick: function () { return setActiveLinkType(linkType); } },
            React.createElement(linkType.getStaticIcon, null))); }),
        React.createElement("div", null, activeLinkType ? (React.createElement(LinkEditor, { key: activeLinkType.id, link: null, linkType: activeLinkType })) : null),
        React.createElement(react_ui_components_1.Button, { onClick: dismiss }, "Cancel"),
        React.createElement(react_ui_components_1.Button, { disabled: true }, "Apply")));
};
var DialogWithValue = function (props) {
    var _a = domain_1.useEditorTransactions(), dismiss = _a.dismiss, update = _a.update, unset = _a.unset, apply = _a.apply;
    var linkType = domain_1.useLinkTypeForHref(props.value.href);
    var _b = __read(React.useState(false), 2), showSettings = _b[0], setShowSettings = _b[1];
    return (React.createElement(React.Fragment, null,
        React.createElement(react_ui_components_1.Button, { isActive: !showSettings, onClick: function () { return setShowSettings(false); } },
            React.createElement(linkType.getIcon, null)),
        React.createElement(react_ui_components_1.Button, { isActive: showSettings, onClick: function () { return setShowSettings(true); } }, "SETTINGS"),
        React.createElement("div", null,
            React.createElement(react_ui_components_1.Button, { onClick: unset }, "Delete")),
        React.createElement("div", null, showSettings ? (React.createElement(react_final_form_1.Form, { onSubmit: function (values) { return update({ options: values }); } }, function (_a) {
            var _b, _c, _d, _e;
            var handleSubmit = _a.handleSubmit;
            return (React.createElement("form", { onSubmit: handleSubmit },
                React.createElement(react_final_form_1.Field, { name: "anchor", initialValue: (_b = props.value.options) === null || _b === void 0 ? void 0 : _b.anchor }, function (_a) {
                    var input = _a.input;
                    return (React.createElement("label", null,
                        "Anchor:",
                        React.createElement("input", __assign({ type: "text" }, input))));
                }),
                React.createElement(react_final_form_1.Field, { name: "title", initialValue: (_c = props.value.options) === null || _c === void 0 ? void 0 : _c.title }, function (_a) {
                    var input = _a.input;
                    return (React.createElement("label", null,
                        "Title:",
                        React.createElement("input", __assign({ type: "text" }, input))));
                }),
                React.createElement(react_final_form_1.Field, { type: "checkbox", name: "targetBlank", initialValue: ((_d = props.value.options) === null || _d === void 0 ? void 0 : _d.targetBlank) ? 'true' : '' }, function (_a) {
                    var input = _a.input;
                    return (React.createElement("label", null,
                        "Open in new Window:",
                        React.createElement("input", __assign({ style: {
                                appearance: 'checkbox',
                                backgroundColor: 'white',
                            }, type: "checkbox" }, input))));
                }),
                React.createElement(react_final_form_1.Field, { type: "checkbox", name: "relNoFollow", initialValue: ((_e = props.value.options) === null || _e === void 0 ? void 0 : _e.relNoFollow) ? 'true' : '' }, function (_a) {
                    var input = _a.input;
                    return (React.createElement("label", null,
                        "No Follow:",
                        React.createElement("input", __assign({ style: {
                                appearance: 'checkbox',
                                backgroundColor: 'white',
                            }, type: "checkbox" }, input))));
                }),
                React.createElement("button", { type: "submit" }, "Apply")));
        })) : (React.createElement(LinkEditor, { key: linkType.id, link: props.value, linkType: linkType }))),
        React.createElement(react_ui_components_1.Button, { onClick: dismiss }, "Click here!"),
        React.createElement(react_ui_components_1.Button, { onClick: function () { return apply(props.value); } }, "Apply")));
};
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
        return (React.createElement(Editor, __assign({}, editorProps)));
    }
};
//# sourceMappingURL=Modal.js.map