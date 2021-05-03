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
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var domain_1 = require("../../../domain");
function useResolvedValue() {
    var value = domain_1.useEditorValue().value;
    if (value) {
        var match = /asset:\/\/(.*)/.exec(value.href);
        if (match) {
            return match[1];
        }
    }
    return null;
}
exports.Asset = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:Asset';
        _this.isSuitableFor = function (props) {
            var _a;
            return Boolean((_a = props.link) === null || _a === void 0 ? void 0 : _a.href.startsWith('asset://'));
        };
        _this.getIcon = function () { return (React.createElement("div", null, "ASSET")); };
        _this.getTitle = function () { return 'ASSET'; };
        _this.getPreview = function () { return (React.createElement("div", null, "ASSET PREVIEW")); };
        _this.getEditor = function () {
            var update = domain_1.useEditorTransactions().update;
            var resolvedValue = useResolvedValue();
            var mediaBrowserUri = archaeopteryx_neos_bridge_1.useRoutes(function (r) { var _a, _b; return (_b = (_a = r.core) === null || _a === void 0 ? void 0 : _a.modules) === null || _b === void 0 ? void 0 : _b.mediaBrowser; });
            React.useEffect(function () {
                window.NeosMediaBrowserCallbacks = {
                    assetChosen: function (assetIdentifier) {
                        update({ href: "asset://" + assetIdentifier });
                    }
                };
                (function () {
                    window.NeosMediaBrowserCallbacks = {};
                });
            }, [update]);
            if (mediaBrowserUri) {
                if (resolvedValue) {
                    return (React.createElement("iframe", { name: "neos-media-selection-screen", src: mediaBrowserUri + "/images/edit.html?asset[__identity]=" + resolvedValue, style: { width: '100%', minHeight: '300px' }, frameBorder: "0", onLoad: function (ev) { var _a, _b; return (_b = (_a = ev.target.contentDocument) === null || _a === void 0 ? void 0 : _a.querySelector('form > .neos-footer')) === null || _b === void 0 ? void 0 : _b.remove(); } }));
                }
                else {
                    return (React.createElement("iframe", { name: "neos-media-selection-screen", src: mediaBrowserUri + "/assets/index.html", style: { width: '100%', minHeight: '300px' }, frameBorder: "0" }));
                }
            }
            else {
                return (React.createElement("div", null, "Media Browser not found."));
            }
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=Asset.js.map