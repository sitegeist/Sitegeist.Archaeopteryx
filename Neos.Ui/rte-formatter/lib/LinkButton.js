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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.LinkButton = void 0;
var React = __importStar(require("react"));
var react_ui_components_1 = require("@neos-project/react-ui-components");
var archaeopteryx_core_1 = require("@sitegeist/archaeopteryx-core");
var LinkButton = function (props) {
    var tx = archaeopteryx_core_1.useEditorTransactions();
    var handleLinkButtonClick = React.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var link, result;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    link = (function () {
                        if (props.formattingUnderCursor.link) {
                            var _a = __read(props.formattingUnderCursor.link.split('#'), 2), href = _a[0], anchor = _a[1];
                            return {
                                href: href,
                                options: {
                                    anchor: anchor,
                                    title: props.formattingUnderCursor.linkTitle,
                                    targetBlank: props.formattingUnderCursor.linkTargetBlank,
                                    relNoFollow: props.formattingUnderCursor.linkRelNofollow
                                }
                            };
                        }
                        return null;
                    })();
                    return [4, tx.editLink(link)];
                case 1:
                    result = _h.sent();
                    if (result.change) {
                        if (result.value === null) {
                            props.executeCommand('linkTitle', false, false);
                            props.executeCommand('linkRelNofollow', false, false);
                            props.executeCommand('linkTargetBlank', false, false);
                            props.executeCommand('unlink');
                        }
                        else {
                            props.executeCommand('linkTitle', ((_a = result.value.options) === null || _a === void 0 ? void 0 : _a.title) || false, false);
                            props.executeCommand('linkTargetBlank', (_c = (_b = result.value.options) === null || _b === void 0 ? void 0 : _b.targetBlank) !== null && _c !== void 0 ? _c : false, false);
                            props.executeCommand('linkRelNofollow', (_e = (_d = result.value.options) === null || _d === void 0 ? void 0 : _d.relNoFollow) !== null && _e !== void 0 ? _e : false, false);
                            if ((_f = result.value.options) === null || _f === void 0 ? void 0 : _f.anchor) {
                                props.executeCommand('link', result.value.href + "#" + ((_g = result.value.options) === null || _g === void 0 ? void 0 : _g.anchor), false);
                            }
                            else {
                                props.executeCommand('link', result.value.href, false);
                            }
                        }
                    }
                    return [2];
            }
        });
    }); }, [props.executeCommand, props.formattingUnderCursor.link, tx]);
    return (React.createElement(react_ui_components_1.IconButton, { title: 'Link', isActive: Boolean(props.formattingUnderCursor.link), icon: Boolean(props.formattingUnderCursor.link) ? 'unlink' : 'link', onClick: handleLinkButtonClick }));
};
exports.LinkButton = LinkButton;
//# sourceMappingURL=LinkButton.js.map