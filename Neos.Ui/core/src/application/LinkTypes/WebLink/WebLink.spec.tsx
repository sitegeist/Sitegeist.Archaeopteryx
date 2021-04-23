import {WebLink} from './WebLink';

describe('WebLinkEditor', () => {
    it('is satisfied by http:// links', () => {
        const props = {
            uri: 'http://www.example.com'
        };

        expect(WebLink.isSatisfiedBy(props))
            .toBe(true);
    });

    it('is satisfied by https:// links', () => {
        const props = {
            uri: 'https://www.example.com'
        };

        expect(WebLink.isSatisfiedBy(props))
            .toBe(true);
    });

    it('is not satisfied by node:// links', () => {
        const props = {
            uri: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        expect(WebLink.isSatisfiedBy(props))
            .toBe(false);
    });

    it('is not satisfied by asset:// links', () => {
        const props = {
            uri: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        expect(WebLink.isSatisfiedBy(props))
            .toBe(false);
    });

    it('is not satisfied by mailto: links', () => {
        const props = {
            uri: 'mailto:foo@example.com'
        };

        expect(WebLink.isSatisfiedBy(props))
            .toBe(false);
    });

    it('is not satisfied by invalid links', () => {
        const props = {
            uri: 'Think of Beethoven\'s 5th: foo foo foo bar'
        };

        expect(WebLink.isSatisfiedBy(props))
            .toBe(false);
    });
});