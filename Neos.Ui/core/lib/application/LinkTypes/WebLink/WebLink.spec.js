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
exports.__esModule = true;
require("@testing-library/jest-dom/extend-expect");
var React = __importStar(require("react"));
var react_1 = require("@testing-library/react");
var WebLink_1 = require("./WebLink");
describe('WebLinkEditor', function () {
    it('is satisfied by http:// links', function () {
        var props = {
            link: {
                href: 'http://www.example.com'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(true);
    });
    it('is satisfied by https:// links', function () {
        var props = {
            link: {
                href: 'https://www.example.com'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(true);
    });
    it('is not satisfied by node:// links', function () {
        var props = {
            link: {
                href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by asset:// links', function () {
        var props = {
            link: {
                href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by mailto: links', function () {
        var props = {
            link: {
                href: 'mailto:foo@example.com'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by invalid links', function () {
        var props = {
            link: {
                href: 'Think of Beethoven\'s 5th: foo foo foo bar'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('returns title for undefined links', function () {
        expect(WebLink_1.WebLink.getTitle({}))
            .toBe('Web Link');
    });
    it('returns title for insecure links', function () {
        expect(WebLink_1.WebLink.getTitle({ link: { href: 'http://www.example.com' } }))
            .toBe('Web Link (not secure)');
    });
    it('returns title for secure links', function () {
        expect(WebLink_1.WebLink.getTitle({ link: { href: 'https://www.example.com' } }))
            .toBe('Web Link (secure)');
    });
    it('renders preview for insecure links', function () { return __awaiter(void 0, void 0, void 0, function () {
        var Preview, els;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Preview = WebLink_1.WebLink.getPreview;
                    react_1.render(React.createElement(Preview, { link: { href: 'http://www.example.com' } }));
                    return [4, react_1.screen.findAllByText('Web Link (not secure)')];
                case 1:
                    els = _a.sent();
                    expect(els.length).toBe(1);
                    expect(els[0].innerHTML).toContain('Web Link (not secure)');
                    return [2];
            }
        });
    }); });
    it('renders preview for secure links', function () { return __awaiter(void 0, void 0, void 0, function () {
        var Preview, els;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Preview = WebLink_1.WebLink.getPreview;
                    react_1.render(React.createElement(Preview, { link: { href: 'https://www.example.com' } }));
                    return [4, react_1.screen.findAllByText('Web Link (secure)')];
                case 1:
                    els = _a.sent();
                    expect(els.length).toBe(1);
                    expect(els[0].innerHTML).toContain('Web Link (secure)');
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=WebLink.spec.js.map