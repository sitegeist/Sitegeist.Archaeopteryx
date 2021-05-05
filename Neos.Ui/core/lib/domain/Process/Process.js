"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAsyncState = exports.success = exports.error = exports.busy = void 0;
var BUSY = { busy: true, error: null, result: null };
function busy() {
    return BUSY;
}
exports.busy = busy;
function error(error) {
    return { busy: false, error: error, result: null };
}
exports.error = error;
function success(result) {
    return { busy: false, error: null, result: result };
}
exports.success = success;
function fromAsyncState(asyncState) {
    var _a, _b;
    return {
        busy: asyncState.loading,
        error: (_a = asyncState.error) !== null && _a !== void 0 ? _a : null,
        result: (_b = asyncState.value) !== null && _b !== void 0 ? _b : null
    };
}
exports.fromAsyncState = fromAsyncState;
//# sourceMappingURL=Process.js.map