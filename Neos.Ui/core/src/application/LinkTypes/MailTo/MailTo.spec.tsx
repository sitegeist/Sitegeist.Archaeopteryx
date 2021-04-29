import '@testing-library/jest-dom/extend-expect';

import * as React from 'react';
import {render, screen} from '@testing-library/react';

import {MailTo} from './MailTo';

describe('MailToEditor', () => {
    it('is not satisfied by http:// links', () => {
        const props = {
            link: {
                uri: 'http://www.example.com'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by https:// links', () => {
        const props = {
            link: {
                uri: 'https://www.example.com'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by node:// links', () => {
        const props = {
            link: {
                uri: 'node://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is not satisfied by asset:// links', () => {
        const props = {
            link: {
                uri: 'asset://97c9a6e3-4b50-4559-9f60-b5ad68f25758'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });

    it('is satisfied by mailto: links', () => {
        const props = {
            link: {
                uri: 'mailto:foo@example.com'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(true);
    });

    it('is not satisfied by invalid links', () => {
        const props = {
            link: {
                uri: 'Think of Beethoven\'s 5th: foo foo foo bar'
            }
        };

        expect(MailTo.isSuitableFor(props))
            .toBe(false);
    });
});