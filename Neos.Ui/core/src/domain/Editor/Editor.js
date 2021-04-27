"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.useEditorTransactions = exports.useEditorValue = exports.useEditorState = exports.EditorContext = exports.createEditor = exports.editorReducer = void 0;
var React = __importStar(require("react"));
var typesafe_actions_1 = require("typesafe-actions");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var actions = __importStar(require("./EditorAction"));
var initialState = {
    isOpen: false,
    value: {
        persistent: null,
        transient: null
    }
};
function editorReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case typesafe_actions_1.getType(actions.EditorWasOpened):
            return {
                isOpen: true,
                value: {
                    transient: action.payload,
                    persistent: action.payload
                }
            };
        case typesafe_actions_1.getType(actions.EditorWasDismissed):
            return {
                isOpen: false,
                value: {
                    transient: null,
                    persistent: null
                }
            };
        case typesafe_actions_1.getType(actions.UriWasUpdated):
            return {
                isOpen: true,
                value: __assign(__assign({}, state.value), { transient: action.payload })
            };
        case typesafe_actions_1.getType(actions.UriWasCleared):
            return {
                isOpen: true,
                value: __assign(__assign({}, state.value), { transient: null })
            };
        case typesafe_actions_1.getType(actions.UpdatedUriWasApplied):
            return {
                isOpen: false,
                value: {
                    transient: null,
                    persistent: null
                }
            };
        default:
            return state;
    }
}
exports.editorReducer = editorReducer;
function createEditor() {
    var actions$ = new rxjs_1.Subject();
    var dispatch = function (action) { return actions$.next(action); };
    var state$ = actions$.pipe(operators_1.scan(editorReducer, initialState), operators_1.shareReplay(1));
    var open = function (uri) { return dispatch(actions.EditorWasOpened(uri)); };
    var dismiss = function () { return dispatch(actions.EditorWasDismissed()); };
    var update = function (updatedUri) {
        return dispatch(actions.UriWasUpdated(updatedUri));
    };
    var clear = function () { return dispatch(actions.UriWasCleared()); };
    var apply = function (updatedUri) {
        return dispatch(actions.UpdatedUriWasApplied(updatedUri));
    };
    var editLink = function (uri) { return new Promise(function (resolve) {
        open(uri);
        actions$.subscribe(function (action) {
            switch (action.type) {
                case typesafe_actions_1.getType(actions.EditorWasDismissed):
                    return resolve({ change: false });
                case typesafe_actions_1.getType(actions.UpdatedUriWasApplied):
                    return resolve({ change: true, value: action.payload });
                default:
                    return;
            }
        });
    }); };
    return {
        state$: state$,
        tx: { dismiss: dismiss, update: update, clear: clear, apply: apply, editLink: editLink },
        initialState: initialState
    };
}
exports.createEditor = createEditor;
exports.EditorContext = React.createContext(createEditor());
function useEditorState() {
    var _a = React.useContext(exports.EditorContext), state$ = _a.state$, initialState = _a.initialState;
    var _b = React.useState(initialState), state = _b[0], setState = _b[1];
    React.useEffect(function () {
        var subscription = state$.subscribe(setState);
        return function () { return subscription.unsubscribe(); };
    }, [state$, initialState]);
    return state;
}
exports.useEditorState = useEditorState;
function useEditorValue() {
    var _a = useEditorState().value, persistent = _a.persistent, transient = _a.transient;
    var isDirty = persistent !== transient;
    return { value: transient, isDirty: isDirty };
}
exports.useEditorValue = useEditorValue;
function useEditorTransactions() {
    var tx = React.useContext(exports.EditorContext).tx;
    return tx;
}
exports.useEditorTransactions = useEditorTransactions;
//# sourceMappingURL=Editor.js.map