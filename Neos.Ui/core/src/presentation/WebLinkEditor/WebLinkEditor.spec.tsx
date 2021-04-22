import { WebLinkEditor } from "./WebLinkEditor";

describe('WebLinkEditor', () => {
    it('can be created from http:// links', () => {
        expect(WebLinkEditor.fromHref('http://www.example.com'))
            .not.toBeNull();
    });

    it('can be created from https:// links', () => {
        expect(WebLinkEditor.fromHref('https://www.example.com'))
            .not.toBeNull();
    });

    it('cannot be created from node:// links', () => {
        expect(WebLinkEditor.fromHref('node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'))
            .toBeNull();
    });

    it('cannot be created from asset:// links', () => {
        expect(WebLinkEditor.fromHref('asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'))
            .toBeNull();
    });

    it('cannot be created from mailto: links', () => {
        expect(WebLinkEditor.fromHref('mailto:foo@example.com'))
            .toBeNull();
    });

    it('cannot be created from invalid links', () => {
        expect(WebLinkEditor.fromHref('Think of Beethoven\'s 5th: foo foo foo bar'))
            .toBeNull();
    });
});