"use strict";
exports.__esModule = true;
var WebLink_1 = require("./WebLink");
describe('WebLinkEditor', function () {
    it('is satisfied by http:// links', function () {
        var props = {
            link: {
                uri: 'http://www.example.com'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(true);
    });
    it('is satisfied by https:// links', function () {
        var props = {
            link: {
                uri: 'https://www.example.com'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(true);
    });
    it('is not satisfied by node:// links', function () {
        var props = {
            link: {
                uri: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by asset:// links', function () {
        var props = {
            link: {
                uri: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by mailto: links', function () {
        var props = {
            link: {
                uri: 'mailto:foo@example.com'
            }
        };
        expect(WebLink_1.WebLink.isSuitableFor(props))
            .toBe(false);
    });
    it('is not satisfied by invalid links', function () {
        var props = {
            link: {
                uri: 'Think of Beethoven\'s 5th: foo foo foo bar'
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
        expect(WebLink_1.WebLink.getTitle({ link: { uri: 'http://www.example.com' } }))
            .toBe('Web Link (not secure)');
    });
    it('returns title for secure links', function () {
        expect(WebLink_1.WebLink.getTitle({ link: { uri: 'https://www.example.com' } }))
            .toBe('Web Link (secure)');
    });
});
//# sourceMappingURL=WebLink.spec.js.map