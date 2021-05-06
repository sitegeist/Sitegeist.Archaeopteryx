"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.MailTo = void 0;
var React = __importStar(require("react"));
var domain_1 = require("../../../domain");
exports.MailTo = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:MailTo';
        _this.isSuitableFor = function (link) {
            return link.href.startsWith('mailto:');
        };
        _this.useResolvedProps = function (link) {
            var _a, _b, _c, _d;
            if (link === undefined) {
                return domain_1.Process.success({ value: null });
            }
            var url = new URL(link.href);
            return domain_1.Process.success({
                value: {
                    recipient: url.pathname,
                    subject: (_a = url.searchParams.get('subject')) !== null && _a !== void 0 ? _a : undefined,
                    cc: (_b = url.searchParams.get('cc')) !== null && _b !== void 0 ? _b : undefined,
                    bcc: (_c = url.searchParams.get('bcc')) !== null && _c !== void 0 ? _c : undefined,
                    body: (_d = url.searchParams.get('body')) !== null && _d !== void 0 ? _d : undefined
                }
            });
        };
        _this.convertPropsToLink = function (props) {
            if (props.value === null) {
                return null;
            }
            var url = new URL("mailto:" + props.value.recipient);
            if (props.value.subject) {
                url.searchParams.set('subject', props.value.subject);
            }
            if (props.value.cc) {
                url.searchParams.set('cc', props.value.cc);
            }
            if (props.value.bcc) {
                url.searchParams.set('bcc', props.value.bcc);
            }
            if (props.value.body) {
                url.searchParams.set('body', props.value.body);
            }
            return { href: url.toString() };
        };
        _this.getStaticIcon = function () { return (React.createElement("div", null, "MAILTO")); };
        _this.getIcon = function () { return (React.createElement("div", null, "MAILTO")); };
        _this.getStaticTitle = function () { return 'MAILTO'; };
        _this.getTitle = function () { return 'MAILTO'; };
        _this.getLoadingPreview = function () { return (React.createElement("div", null, "MAILTO PREVIEW")); };
        _this.getPreview = function (props) { return (React.createElement("div", null, "MAILTO PREVIEW")); };
        _this.getLoadingEditor = function () { return (React.createElement("div", null, "MAILTO EDITOR")); };
        _this.getEditor = function (props) {
            var _a, _b, _c, _d;
            return (React.createElement("div", null,
                React.createElement(domain_1.Field, { name: "value.recipient", initialValue: (_a = props.value) === null || _a === void 0 ? void 0 : _a.recipient, validate: function (value) {
                        if (!value) {
                            return 'recipient is required';
                        }
                    } }, function (_a) {
                    var input = _a.input, meta = _a.meta;
                    return (React.createElement("div", null,
                        React.createElement("label", null,
                            "Recipient:",
                            React.createElement("input", __assign({ type: "text" }, input))),
                        meta.error));
                }),
                React.createElement(domain_1.Field, { name: "value.cc", initialValue: (_b = props.value) === null || _b === void 0 ? void 0 : _b.cc }, function (_a) {
                    var input = _a.input, meta = _a.meta;
                    return (React.createElement("div", null,
                        React.createElement("label", null,
                            "CC:",
                            React.createElement("input", __assign({ type: "text" }, input))),
                        meta.error));
                }),
                React.createElement(domain_1.Field, { name: "value.bcc", initialValue: (_c = props.value) === null || _c === void 0 ? void 0 : _c.bcc }, function (_a) {
                    var input = _a.input, meta = _a.meta;
                    return (React.createElement("div", null,
                        React.createElement("label", null,
                            "BCC:",
                            React.createElement("input", __assign({ type: "text" }, input))),
                        meta.error));
                }),
                React.createElement(domain_1.Field, { name: "value.body", initialValue: (_d = props.value) === null || _d === void 0 ? void 0 : _d.body }, function (_a) {
                    var input = _a.input, meta = _a.meta;
                    return (React.createElement("div", null,
                        React.createElement("label", null,
                            "Body:",
                            React.createElement("textarea", __assign({}, input))),
                        meta.error));
                })));
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=MailTo.js.map