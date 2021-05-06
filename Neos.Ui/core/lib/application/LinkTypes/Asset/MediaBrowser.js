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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaBrowser = void 0;
var React = __importStar(require("react"));
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var MediaBrowser = function (props) {
    var mediaBrowserUri = archaeopteryx_neos_bridge_1.useRoutes(function (r) { var _a, _b; return (_b = (_a = r.core) === null || _a === void 0 ? void 0 : _a.modules) === null || _b === void 0 ? void 0 : _b.mediaBrowser; });
    React.useEffect(function () {
        window.NeosMediaBrowserCallbacks = {
            assetChosen: function (assetIdentifier) {
                props.onSelectAsset(assetIdentifier);
            }
        };
        (function () {
            window.NeosMediaBrowserCallbacks = {};
        });
    }, [props.onSelectAsset]);
    if (!mediaBrowserUri) {
        throw new Error('[Sitegeist.Archaeopteryx]: Could not resolve mediaBrowserUri.');
    }
    if (props.assetIdentifier) {
        return (React.createElement("iframe", { name: "neos-media-selection-screen", src: mediaBrowserUri + "/images/edit.html?asset[__identity]=" + props.assetIdentifier, style: { width: '100%', minHeight: '467px' }, frameBorder: "0", onLoad: function (ev) {
                var _a, _b;
                var iframe = ev.target.contentDocument;
                (_a = iframe === null || iframe === void 0 ? void 0 : iframe.querySelector('form > .neos-footer')) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = iframe === null || iframe === void 0 ? void 0 : iframe.querySelectorAll('input, select, textarea')) === null || _b === void 0 ? void 0 : _b.forEach(function (input) {
                    input.readOnly = true;
                });
            } }));
    }
    else {
        return (React.createElement("iframe", { name: "neos-media-selection-screen", src: mediaBrowserUri + "/assets/index.html", style: { width: '100%', minHeight: '467px' }, frameBorder: "0" }));
    }
};
exports.MediaBrowser = MediaBrowser;
//# sourceMappingURL=MediaBrowser.js.map