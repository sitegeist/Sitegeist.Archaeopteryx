"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoutes = void 0;
var NeosContext_1 = require("./NeosContext");
function useRoutes(selector) {
    var neos = NeosContext_1.useNeos();
    if (neos.routes) {
        if (selector) {
            return selector(neos.routes);
        }
        else {
            return neos.routes;
        }
    }
}
exports.useRoutes = useRoutes;
//# sourceMappingURL=Routes.js.map