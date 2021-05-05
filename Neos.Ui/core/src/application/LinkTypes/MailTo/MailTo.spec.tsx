jest.mock('@neos-project/neos-ui-backend-connector', () => ({}), { virtual: true });
jest.mock('@neos-project/react-ui-components', () => ({}));

import '@testing-library/jest-dom/extend-expect';

import {MailTo} from './MailTo';

describe('LinkType: MailTo', () => {
    it('is not satisfied by http:// links', () => {
        const props = {
            link: {
                href: 'http://www.example.com'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by https:// links', () => {
        const props = {
            link: {
                href: 'https://www.example.com'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by node:// links', () => {
        const props = {
            link: {
                href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by asset:// links', () => {
        const props = {
            link: {
                href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is satisfied by mailto: links', () => {
        const props = {
            link: {
                href: 'mailto:foo@example.com'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(true);
    });

    it('is not satisfied by invalid links', () => {
        const props = {
            link: {
                href: 'Think of Beethoven\'s 5th: foo foo foo bar'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });
});