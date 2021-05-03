"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfiguration = void 0;
var NeosContext_1 = require("./NeosContext");
function useConfiguration(selector) {
    var neos = NeosContext_1.useNeos();
    if (neos) {
        if (selector) {
            return selector(neos.configuration);
        }
        else {
            return neos.configuration;
        }
    }
}
exports.useConfiguration = useConfiguration;
//# sourceMappingURL=Configuration.js.map