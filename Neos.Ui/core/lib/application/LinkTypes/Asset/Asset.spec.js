"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@neos-project/neos-ui-backend-connector', function () { return ({}); }, { virtual: true });
jest.mock('@neos-project/react-ui-components', function () { return ({}); });
require("@testing-library/jest-dom/extend-expect");
var Asset_1 = require("./Asset");
describe('AssetEditor', function () {
    it('is not satisfied by http:// links', function () {
        var props = {
            link: {
                href: 'http://www.example.com'
            }
        };
        expect(Asset_1.Asset.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by https:// links', function () {
        var props = {
            link: {
                href: 'https://www.example.com'
            }
        };
        expect(Asset_1.Asset.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by node:// links', function () {
        var props = {
            link: {
                href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };
        expect(Asset_1.Asset.isSuitableFor(props))
            .toBe(false);
    });
    it('is satisfied by asset:// links', function () {
        var props = {
            link: {
                href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };
        expect(Asset_1.Asset.isSuitableFor(props))
            .toBe(true);
    });
    it('is not satisfied by mailto: links', function () {
        var props = {
            link: {
                href: 'mailto:foo@example.com'
            }
        };
        expect(Asset_1.Asset.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by invalid links', function () {
        var props = {
            link: {
                href: 'Think of Beethoven\'s 5th: foo foo foo bar'
            }
        };
        expect(Asset_1.Asset.isSuitableFor(props))
            .toBe(false);
    });
});
//# sourceMappingURL=Asset.spec.js.map