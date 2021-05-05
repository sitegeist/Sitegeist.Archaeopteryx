jest.mock('@neos-project/neos-ui-backend-connector', () => ({}), { virtual: true });
jest.mock('@neos-project/react-ui-components', () => ({}));

import '@testing-library/jest-dom/extend-expect';

import * as React from 'react';
import {render, screen} from '@testing-library/react';

import {Web} from './Web';

describe('LinType: Web', () => {
    it('is satisfied by http:// links', () => {
        const link = {
            href: 'http://www.example.com'
        };

        expect(Web.isSuitableFor(link))
            .toBe(true);
    });

    it('is satisfied by https:// links', () => {
        const link = {
            href: 'https://www.example.com'
        };

        expect(Web.isSuitableFor(link))
            .toBe(true);
    });

    it('is not satisfied by node:// links', () => {
        const link = {
            href: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        expect(Web.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by asset:// links', () => {
        const link = {
            href: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
        };

        expect(Web.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by mailto: links', () => {
        const link = {
            href: 'mailto:foo@example.com'
        };

        expect(Web.isSuitableFor(link))
            .toBe(false);
    });

    it('is not satisfied by invalid links', () => {
        const link = {
            href: 'Think of Beethoven\'s 5th: foo foo foo bar'
        };

        expect(Web.isSuitableFor(link))
            .toBe(false);
    });


    it('returns title for undefined links', () => {
        expect(Web.getTitle({value: null}))
            .toBe('Web Link');
    });

    it('returns title for insecure links', () => {
        expect(Web.getTitle({value: {protocol: 'http', urlWithoutProtocol: 'www.example.com'}}))
            .toBe('Web Link (not secure)');
    });

    it('returns title for secure links', () => {
        expect(Web.getTitle({value: {protocol: 'https', urlWithoutProtocol: 'www.example.com'}}))
            .toBe('Web Link (secure)');
    });

    it('renders preview for insecure links', async () => {
        const {getPreview: Preview} = Web;

        render(<Preview value={{protocol: 'http', urlWithoutProtocol: 'www.example.com'}}/>);

        const els = await screen.findAllByText('Web Link (not secure)');

        expect(els.length).toBe(1);
        expect(els[0].innerHTML).toContain('Web Link (not secure)');
    });

    it('renders preview for secure links', async () => {
        const {getPreview: Preview} = Web;

        render(<Preview value={{protocol: 'https', urlWithoutProtocol: 'www.example.com'}}/>);

        const els = await screen.findAllByText('Web Link (secure)');

        expect(els.length).toBe(1);
        expect(els[0].innerHTML).toContain('Web Link (secure)');
    });
});