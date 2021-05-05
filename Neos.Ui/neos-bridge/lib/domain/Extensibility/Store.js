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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelector = void 0;
var React = __importStar(require("react"));
var NeosContext_1 = require("./NeosContext");
function useSelector(selector) {
    var neos = NeosContext_1.useNeos();
    var neosWasInitiallyLoadedRef = React.useRef(Boolean(neos));
    var _a = __read(React.useState(neos ? selector(neos.store.getState()) : null), 2), result = _a[0], setResult = _a[1];
    React.useEffect(function () {
        if (neos) {
            var state = neos.store.getState();
            if (!neosWasInitiallyLoadedRef.current) {
                var result_1 = selector(state);
                setResult(result_1);
            }
            return neos.store.subscribe(function () {
                var state = neos.store.getState();
                var result = selector(state);
                setResult(result);
            });
        }
    }, [neos]);
    return result;
}
exports.useSelector = useSelector;
//# sourceMappingURL=Store.js.map