jest.mock('@neos-project/neos-ui-backend-connector', () => ({}), { virtual: true });
jest.mock('@neos-project/react-ui-components', () => ({}));
jest.mock('@neos-project/neos-ui-redux-store', () => ({}), { virtual: true });
jest.mock('@neos-project/neos-ui-editors', () => ({}), { virtual: true });

jest.mock('../../../presentation', () => ({}));

import '@testing-library/jest-dom/extend-expect';

import {Asset} from './Asset';

describe('LinkType: Asset', () => {
    it('is not satisfied by http:// links', () => {
        const link = {
            href: 'http://www.example.com'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by https:// links', () => {
        const link = {
            href: 'https://www.example.com'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by node:// links', () => {
        const link = {
            href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(false);
    });

    it('is satisfied by asset:// links', () => {
        const link = {
            href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(true);
    });

    it('is not satisfied by asset:// links with a hash', () => {
        const link = {
            href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758#section'
        };

        expect(Asset.isSuitableFor(link))
                .toBe(false);
    });

    it('is not satisfied by mailto: links', () => {
        const link = {
            href: 'mailto:foo@example.com'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by invalid links', () => {
        const link = {
            href: 'Think of Beethoven\'s 5th: foo foo foo bar'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by tel: links', () => {
        const link = {
            href: 'tel:+491258795857'
        };

        expect(Asset.isSuitableFor(link))
            .toBe(false);
    });
});
