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
exports.WebLink = void 0;
var React = __importStar(require("react"));
var Icon = function () { return React.createElement("div", null, "ICON"); };
var Title = function (props) {
    return "WebLink " + (props.uri.startsWith('https://') ? '(secure)' : '(not secure)');
};
var Preview = function () { return React.createElement("div", null, "PREVIEW"); };
var Editor = function () { return React.createElement("div", null, "EDITOR"); };
var isSatisfiedBy = function (_a) {
    var uri = _a.uri;
    var isHttp = uri.startsWith('http://');
    var isHttps = uri.startsWith('https://');
    return isHttp || isHttps;
};
exports.WebLink = {
    Icon: Icon,
    Title: Title,
    Preview: Preview,
    Editor: Editor,
    isSatisfiedBy: isSatisfiedBy
};
//# sourceMappingURL=WebLink.js.map