"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.q = void 0;
var Backend_1 = require("../domain/Backend");
var neos_ui_backend_connector_1 = __importDefault(require("@neos-project/neos-ui-backend-connector"));
function q(context) {
    var q = neos_ui_backend_connector_1.default.get().q;
    return new Backend_1.FlowQuery(q(Array.isArray(context)
        ? context.map(function (cp) { return cp.toString(); })
        : context.toString()));
}
exports.q = q;
//# sourceMappingURL=FlowQuery.js.map