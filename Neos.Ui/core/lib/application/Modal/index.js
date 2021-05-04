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
exports.registerModal = void 0;
var React = __importStar(require("react"));
var archaeopteryx_neos_bridge_1 = require("@sitegeist/archaeopteryx-neos-bridge");
var domain_1 = require("../../domain");
var Modal_1 = require("./Modal");
function registerModal(neosContextProperties, editor) {
    var globalRegistry = neosContextProperties.globalRegistry;
    var containersRegistry = globalRegistry.get('containers');
    containersRegistry === null || containersRegistry === void 0 ? void 0 : containersRegistry.set('Modals/Sitegeist.Archaeopteryx', function (props) { return (React.createElement(archaeopteryx_neos_bridge_1.NeosContext.Provider, { value: neosContextProperties },
        React.createElement(domain_1.EditorContext.Provider, { value: editor }, React.createElement(Modal_1.Modal, props)))); });
}
exports.registerModal = registerModal;
//# sourceMappingURL=index.js.map