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
    var _b = domain_1.useEditorTransactions(), dismiss = _b.dismiss, update = _b.update, apply = _b.apply;
    var linkTypes = domain_1.useLinkTypes();
    var _c = __read(React.useState(false), 2), showSettings = _c[0], setShowSettings = _c[1];
    var _d = __read(React.useState(linkTypes[0]), 2), activeLinkType = _d[0], setActiveLinkType = _d[1];
    var Editor = (activeLinkType !== null && activeLinkType !== void 0 ? activeLinkType : {}).getEditor;
    React.useEffect(function () {
        var _a;
        setActiveLinkType((_a = linkTypes.find(function (linkType) { return value.persistent && linkType.isSuitableFor({
            link: value.persistent
        }); })) !== null && _a !== void 0 ? _a : linkTypes[0]);
    }, [value.persistent]);
    return (React.createElement(react_ui_components_1.Dialog, { title: "Sitegeist.Archaeopteryx", isOpen: isOpen, onRequestClose: dismiss, style: "jumbo" },
        linkTypes.map(function (linkType) {
            var Icon = linkType.getIcon, id = linkType.id;
            return (React.createElement(react_ui_components_1.Button, { isActive: linkType.id === (activeLinkType === null || activeLinkType === void 0 ? void 0 : activeLinkType.id), key: id, onClick: function () {
                    setActiveLinkType(linkType);
                    setShowSettings(false);
                } },
                React.createElement(Icon, null)));
        }),
        React.createElement(react_ui_components_1.Button, { isActive: showSettings, onClick: function () {
                setActiveLinkType(null);
                setShowSettings(true);
            } }, "SETTINGS"),
        React.createElement("div", null,
            Editor ? (React.createElement(Editor, null)) : null,
            showSettings ? (React.createElement(react_final_form_1.Form, { onSubmit: function (values) { return update({ options: values }); } }, function (_a) {
                var _b, _c, _d, _e, _f, _g, _h, _j;
                var handleSubmit = _a.handleSubmit;
                return (React.createElement("form", { onSubmit: handleSubmit },
                    React.createElement(react_final_form_1.Field, { name: "anchor", initialValue: (_c = (_b = value.transient) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.anchor }, function (_a) {
                        var input = _a.input;
                        return (React.createElement("label", null,
                            "Anchor:",
                            React.createElement("input", __assign({ type: "text" }, input))));
                    }),
                    React.createElement(react_final_form_1.Field, { name: "title", initialValue: (_e = (_d = value.transient) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.title }, function (_a) {
                        var input = _a.input;
                        return (React.createElement("label", null,
                            "Title:",
                            React.createElement("input", __assign({ type: "text" }, input))));
                    }),
                    React.createElement(react_final_form_1.Field, { type: "checkbox", name: "targetBlank", initialValue: ((_g = (_f = value.transient) === null || _f === void 0 ? void 0 : _f.options) === null || _g === void 0 ? void 0 : _g.targetBlank) ? 'true' : '' }, function (_a) {
                        var input = _a.input;
                        return (React.createElement("label", null,
                            "Open in new Window:",
                            React.createElement("input", __assign({ style: {
                                    appearance: 'checkbox',
                                    backgroundColor: 'white',
                                }, type: "checkbox" }, input))));
                    }),
                    React.createElement(react_final_form_1.Field, { type: "checkbox", name: "relNoFollow", initialValue: ((_j = (_h = value.transient) === null || _h === void 0 ? void 0 : _h.options) === null || _j === void 0 ? void 0 : _j.relNoFollow) ? 'true' : '' }, function (_a) {
                        var input = _a.input;
                        return (React.createElement("label", null,
                            "No Follow:",
                            React.createElement("input", __assign({ style: {
                                    appearance: 'checkbox',
                                    backgroundColor: 'white',
                                }, type: "checkbox" }, input))));
                    }),
                    React.createElement("button", { type: "submit" }, "Apply")));
            })) : null),
        React.createElement(react_ui_components_1.Button, { onClick: dismiss }, "Click here!"),
        React.createElement(react_ui_components_1.Button, { onClick: function () { return apply(value.transient); } }, "Apply")));
};
exports.Modal = Modal;
//# sourceMappingURL=Modal.js.map