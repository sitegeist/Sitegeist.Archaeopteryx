jest.mock('@neos-project/neos-ui-backend-connector', () => ({}), { virtual: true });
jest.mock('@neos-project/react-ui-components', () => ({}));
jest.mock('@neos-project/neos-ui-redux-store', () => ({}), { virtual: true });

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
});