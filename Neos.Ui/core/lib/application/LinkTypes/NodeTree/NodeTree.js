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
exports.NodeTree = void 0;
var React = __importStar(require("react"));
var domain_1 = require("../../../domain");
var NodeTreeAdapter_1 = require("./NodeTreeAdapter");
exports.NodeTree = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:NodeTree';
        _this.isSuitableFor = function (props) {
            var _a;
            return Boolean((_a = props.link) === null || _a === void 0 ? void 0 : _a.uri.startsWith('node://'));
        };
        _this.getIcon = function () { return (React.createElement("div", null, "NODE TREE")); };
        _this.getTitle = function () { return 'Node Tree'; };
        _this.getPreview = function () { return (React.createElement("div", null, "NODE TREE PREVIEW")); };
        _this.getEditor = function () {
            var value = domain_1.useEditorValue().value;
            var update = domain_1.useEditorTransactions().update;
            var onChange = React.useCallback(function (ev) {
                return update(ev.target.value);
            }, [update]);
            return (React.createElement(NodeTreeAdapter_1.NodeTreeAdapter, null));
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=NodeTree.js.map