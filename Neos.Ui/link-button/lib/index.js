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
exports.registerLinkButton = void 0;
var React = __importStar(require("react"));
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var archaeopteryx_core_1 = require("@sitegeist/archaeopteryx-core");
var LinkButton_1 = require("./LinkButton");
function registerLinkButton(neosContextProperties, editor) {
    var globalRegistry = neosContextProperties.globalRegistry;
    var ckeditor5Registry = globalRegistry.get('ckEditor5');
    if (!ckeditor5Registry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of RTE formatter...');
        return;
    }
    var richtextToolbarRegistry = ckeditor5Registry.get('richtextToolbar');
    if (!richtextToolbarRegistry) {
        console.warn('[Sitegeist.Archaeopteryx]: Could not find ckeditor5 richtextToolbar registry.');
        console.warn('[Sitegeist.Archaeopteryx]: Skipping registration of RTE formatter...');
        return;
    }
    richtextToolbarRegistry.set('link', {
        commandName: 'link',
        component: function (props) { return (React.createElement(archaeopteryx_neos_bridge_1.NeosContext.Provider, { value: neosContextProperties },
            React.createElement(archaeopteryx_core_1.EditorContext.Provider, { value: editor }, React.createElement(LinkButton_1.LinkButton, props)))); },
        isVisible: function (config) { return Boolean(config && config.formatting && config.formatting.a); }
    });
}
exports.registerLinkButton = registerLinkButton;
//# sourceMappingURL=index.js.map