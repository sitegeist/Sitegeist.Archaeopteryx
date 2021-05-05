"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@neos-project/neos-ui-backend-connector', function () { return ({}); }, { virtual: true });
jest.mock('@neos-project/react-ui-components', function () { return ({}); });
require("@testing-library/jest-dom/extend-expect");
var Asset_1 = require("./Asset");
describe('LinkType: Asset', function () {
    it('is not satisfied by http:// links', function () {
        var link = {
            href: 'http://www.example.com'
        };
        expect(Asset_1.Asset.isSuitableFor(link))
            .toBe(false);
    });
    it('is not satisfied by https:// links', function () {
        var link = {
            href: 'https://www.example.com'
        };
        expect(Asset_1.Asset.isSuitableFor(link))
            .toBe(false);
    });
    it('is not satisfied by node:// links', function () {
        var link = {
            href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };
        expect(Asset_1.Asset.isSuitableFor(link))
            .toBe(false);
    });
    it('is satisfied by asset:// links', function () {
        var link = {
            href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };
        expect(Asset_1.Asset.isSuitableFor(link))
            .toBe(true);
    });
    it('is not satisfied by mailto: links', function () {
        var link = {
            href: 'mailto:foo@example.com'
        };
        expect(Asset_1.Asset.isSuitableFor(link))
            .toBe(false);
    });
    it('is not satisfied by invalid links', function () {
        var link = {
            href: 'Think of Beethoven\'s 5th: foo foo foo bar'
        };
        expect(Asset_1.Asset.isSuitableFor(link))
            .toBe(false);
    });
});
//# sourceMappingURL=Asset.spec.js.map