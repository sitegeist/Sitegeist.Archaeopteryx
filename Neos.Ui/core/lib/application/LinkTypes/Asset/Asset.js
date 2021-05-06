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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
var React = __importStar(require("react"));
var domain_1 = require("../../../domain");
var MediaBrowser_1 = require("./MediaBrowser");
exports.Asset = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:Asset';
        _this.isSuitableFor = function (link) {
            return link.href.startsWith('asset://');
        };
        _this.useResolvedProps = function (link) {
            if (link === undefined) {
                return domain_1.Process.success({ assetIdentifier: null });
            }
            var match = /asset:\/\/(.*)/.exec(link.href);
            if (match) {
                return domain_1.Process.success({ assetIdentifier: match[1] });
            }
            return domain_1.Process.error(_this.error("Cannot handle href \"" + link.href + "\"."));
        };
        _this.convertPropsToLink = function (props) {
            if (props.assetIdentifier === null) {
                return null;
            }
            return {
                href: "asset://" + props.assetIdentifier
            };
        };
        _this.getStaticIcon = function () { return (React.createElement("div", null, "ASSET")); };
        _this.getIcon = function () { return (React.createElement("div", null, "ASSET")); };
        _this.getStaticTitle = function () { return 'ASSET'; };
        _this.getTitle = function () { return 'ASSET'; };
        _this.getLoadingPreview = function () { return (React.createElement("div", null, "ASSET PREVIEW")); };
        _this.getPreview = function () { return (React.createElement("div", null, "ASSET PREVIEW")); };
        _this.getLoadingEditor = function () { return (React.createElement("div", null, "ASSET EDITOR")); };
        _this.getEditor = function (props) {
            return (React.createElement(domain_1.Field, { name: "assetIdentifier", initialValue: props.assetIdentifier }, function (_a) {
                var input = _a.input;
                return (React.createElement(MediaBrowser_1.MediaBrowser, { assetIdentifier: input.value, onSelectAsset: input.onChange }));
            }));
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=Asset.js.map