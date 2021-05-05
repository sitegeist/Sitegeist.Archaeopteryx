"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Web = void 0;
var React = __importStar(require("react"));
var domain_1 = require("../../../domain");
exports.Web = new (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'Sitegeist.Archaeopteryx:Web';
        _this.isSuitableFor = function (link) {
            var isHttp = link.href.startsWith('http://');
            var isHttps = link.href.startsWith('https://');
            return isHttp || isHttps;
        };
        _this.useResolvedProps = function (link) {
            if (link === undefined) {
                return domain_1.Process.success({ value: null });
            }
            var matches = link.href.match(/^(https?):\/\/(.*)$/);
            if (matches) {
                var _a = __read(matches, 3), protocol = _a[1], urlWithoutProtocol = _a[2];
                return domain_1.Process.success({
                    value: {
                        protocol: protocol,
                        urlWithoutProtocol: urlWithoutProtocol
                    }
                });
            }
            return domain_1.Process.error(_this.error("Cannot handle href \"" + link.href + "\"."));
        };
        _this.getStaticIcon = function () { return (React.createElement("div", null, "ICON")); };
        _this.getIcon = function () { return (React.createElement("div", null, "ICON")); };
        _this.getStaticTitle = function () {
            return 'Web Link';
        };
        _this.getTitle = function (props) {
            if (props.value === null) {
                return _this.getStaticTitle();
            }
            var isSecure = props.value.protocol === 'https';
            if (isSecure) {
                return 'Web Link (secure)';
            }
            else {
                return 'Web Link (not secure)';
            }
        };
        _this.getLoadingPreview = function () { return (React.createElement("div", null, _this.getStaticTitle())); };
        _this.getPreview = function (props) { return (React.createElement("div", null, _this.getTitle(props))); };
        _this.getLoadingEditor = function () { return (React.createElement("div", null, _this.getStaticTitle())); };
        _this.getEditor = function () {
            var _a;
            var value = domain_1.useEditorValue().value;
            var update = domain_1.useEditorTransactions().update;
            var onChange = React.useCallback(function (ev) {
                return update({ href: ev.target.value });
            }, [update]);
            return (React.createElement("input", { type: "text", value: (_a = value === null || value === void 0 ? void 0 : value.href) !== null && _a !== void 0 ? _a : '', onChange: onChange }));
        };
        return _this;
    }
    return class_1;
}(domain_1.LinkType));
//# sourceMappingURL=Web.js.map