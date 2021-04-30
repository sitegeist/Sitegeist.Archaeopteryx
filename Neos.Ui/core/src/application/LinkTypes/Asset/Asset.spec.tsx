import '@testing-library/jest-dom/extend-expect';

import {Asset} from './Asset';

describe('AssetEditor', () => {
    it('is not satisfied by http:// links', () => {
        const props = {
            link: {
                href: 'http://www.example.com'
            }
        };

        expect(Asset.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by https:// links', () => {
        const props = {
            link: {
                href: 'https://www.example.com'
            }
        };

        expect(Asset.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by node:// links', () => {
        const props = {
            link: {
                href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };

        expect(Asset.isSuitableFor(props))
            .toBe(false);
    });

    it('is satisfied by asset:// links', () => {
        const props = {
            link: {
                href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };

        expect(Asset.isSuitableFor(props))
            .toBe(true);
    });

    it('is not satisfied by mailto: links', () => {
        const props = {
            link: {
                href: 'mailto:foo@example.com'
            }
        };

        expect(Asset.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by invalid links', () => {
        const props = {
            link: {
                href: 'Think of Beethoven\'s 5th: foo foo foo bar'
            }
        };

        expect(Asset.isSuitableFor(props))
            .toBe(false);
    });
});