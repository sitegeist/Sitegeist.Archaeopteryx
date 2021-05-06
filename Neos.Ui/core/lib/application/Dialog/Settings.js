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
exports.Settings = void 0;
var React = __importStar(require("react"));
var react_final_form_1 = require("react-final-form");
var Settings = function (props) {
    var _a, _b, _c, _d;
    return (React.createElement("div", null,
        React.createElement(react_final_form_1.Field, { name: "anchor", initialValue: (_a = props.initialValue) === null || _a === void 0 ? void 0 : _a.anchor }, function (_a) {
            var input = _a.input;
            return (React.createElement("label", null,
                "Anchor:",
                React.createElement("input", __assign({ type: "text" }, input))));
        }),
        React.createElement(react_final_form_1.Field, { name: "title", initialValue: (_b = props.initialValue) === null || _b === void 0 ? void 0 : _b.title }, function (_a) {
            var input = _a.input;
            return (React.createElement("label", null,
                "Title:",
                React.createElement("input", __assign({ type: "text" }, input))));
        }),
        React.createElement(react_final_form_1.Field, { type: "checkbox", name: "targetBlank", initialValue: ((_c = props.initialValue) === null || _c === void 0 ? void 0 : _c.targetBlank) ? 'true' : '' }, function (_a) {
            var input = _a.input;
            return (React.createElement("label", null,
                "Open in new Window:",
                React.createElement("input", __assign({ style: {
                        appearance: 'checkbox',
                        backgroundColor: 'white',
                    }, type: "checkbox" }, input))));
        }),
        React.createElement(react_final_form_1.Field, { type: "checkbox", name: "relNoFollow", initialValue: ((_d = props.initialValue) === null || _d === void 0 ? void 0 : _d.relNoFollow) ? 'true' : '' }, function (_a) {
            var input = _a.input;
            return (React.createElement("label", null,
                "No Follow:",
                React.createElement("input", __assign({ style: {
                        appearance: 'checkbox',
                        backgroundColor: 'white',
                    }, type: "checkbox" }, input))));
        })));
};
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map